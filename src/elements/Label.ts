import { BoundingBox, Element } from './Element';
import { IActionable, IMovable, ISelectable } from '../tools/Selector';
import { Cursor } from '../utils/Cursor';
import { SettingsGroups } from '../managers/popups/SettingsWindowPopup';
import { Stage } from './Stage';

export interface ILabelHost {
	onLabelChanged(label: Label): void;
	getLabelOwnershipHintLocation(x: number, y: number): { x: number; y: number };
}

type TextAlign = 'left' | 'center' | 'right';
type FontStyle = 'normal' | 'italic' | 'oblique';
type FontVariant = 'normal' | 'small-caps';
type FontWeight = 'normal' | 'bold';
type FontFamily = 'courier' | 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui';

export interface ILabelOptions {
	x: number;
	y: number;
	width: number;
	height: number;
	text?: string;

	autoResize?: boolean;
	minWidth?: number;
	maxWidth?: number;
	minHeight?: number;
	maxHeight?: number;

	fillStyle?: string;
	textAlign?: TextAlign;
	fontStyle?: FontStyle;
	fontVariant?: FontVariant;
	fontWeight?: FontWeight;
	fontSize?: number;
	lineHeight?: number;
	fontFamily?: FontFamily;
}

export class Label extends Element implements ISelectable, IMovable, IActionable {
	private mX: number;
	private mY: number;
	private mWidth: number;
	private mHeight: number;
	private mText: string;

	private readonly mFillStyle: string;
	private readonly mTextAlign: TextAlign;
	private readonly mFontStyle: FontStyle;
	private readonly mFontVariant: FontVariant;
	private readonly mFontWeight: FontWeight;
	private readonly mFontSize: number;
	private readonly mLineHeight: number;
	private readonly mFontFamily: FontFamily;

	private readonly mOwner: (Element & ILabelHost) | null;

	private mIsMoving: boolean;
	private mMoveStartX: number;
	private mMoveStartY: number;
	private mTempBox: BoundingBox;

	private readonly mAutoResize: boolean;
	private readonly mShouldResize: boolean;
	private readonly mMinWidth: number | null;
	private readonly mMaxWidth: number | null;
	private readonly mMinHeight: number | null;
	private readonly mMaxHeight: number | null;

	public constructor(owner: (Element & ILabelHost) | Stage, options: ILabelOptions) {
		super(owner instanceof Stage ? owner : owner.parent);

		this.mOwner = owner instanceof Stage ? null : owner;

		this.mX = options.x;
		this.mY = options.y;
		this.mWidth = options.width;
		this.mHeight = options.height;
		this.mText = options.text ?? '';

		this.mFillStyle = options.fillStyle ?? 'black';
		this.mTextAlign = options.textAlign ?? 'center';
		this.mFontStyle = options.fontStyle ?? 'normal';
		this.mFontVariant = options.fontVariant ?? 'normal';
		this.mFontWeight = options.fontWeight ?? 'normal';
		this.mFontSize = options.fontSize ?? 10; // eslint-disable-line no-magic-numbers
		this.mLineHeight = options.lineHeight ?? 1.1; // eslint-disable-line no-magic-numbers
		this.mFontFamily = options.fontFamily ?? 'courier';

		this.mIsMoving = false;
		this.mMoveStartX = 0;
		this.mMoveStartY = 0;
		this.mTempBox = this.boundingBox;

		this.mAutoResize = options.autoResize ?? false;
		this.mShouldResize = this.mAutoResize;
		this.mMinWidth = options.minWidth ?? null;
		this.mMaxWidth = options.maxWidth ?? null;
		this.mMinHeight = options.minHeight ?? null;
		this.mMaxHeight = options.maxHeight ?? null;
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.save();
		this.resize(c);
		const { x, y, width, height } = this.boundingBox;
		c.rect(x, y, width, height);
		c.clip();

		c.fillStyle = this.mFillStyle;
		c.font = `${this.mFontStyle} ${this.mFontVariant} ${this.mFontWeight} ${this.mFontSize}px /${this.mLineHeight} ${this.mFontFamily}`;
		c.textBaseline = 'middle';
		c.textAlign = this.mTextAlign;

		const lineHeight = this.mFontSize * this.mLineHeight;
		const lines = this.text.split('\n');
		let cy = y;
		let cx: number;
		switch(this.mTextAlign) {
			case 'left': {
				cx = x;
				break;
			}
			case 'center': {
				cx = x + (width / 2);
				break;
			}
			case 'right': {
				cx = x + width;
				break;
			}
		}

		for(const line of lines) {
			c.fillText(line, cx, cy + (lineHeight / 2));
			cy += lineHeight;
		}

		if(this.isSelected) {
			c.strokeStyle = Element.SELECTED_STROKESTYLE;
			c.strokeRect(x, y, width, height);

			if(this.mOwner !== null) {
				c.restore();
				c.save();
				const { x: tx, y: ty } = this.mOwner.getLabelOwnershipHintLocation(x + (width / 2), y + (height / 2));
				c.strokeStyle = Element.SELECTED_STROKESTYLE;
				c.lineWidth = 1;
				c.setLineDash([10, 10]); // eslint-disable-line no-magic-numbers
				c.beginPath();
				c.moveTo(tx, ty);
				c.lineTo(x + (width / 2), y + (height / 2));
				c.stroke();
			}
		}

		c.restore();
	}

	public get boundingBox(): BoundingBox {
		if(this.mIsMoving) {
			return this.mTempBox;
		}
		else {
			return { x: this.mX, y: this.mY, width: this.mWidth, height: this.mHeight };
		}
	}

	public getElementUnderPosition(x: number, y: number): Element | null {
		const { x: bx, y: by, width: bwidth, height: bheight } = this.boundingBox;
		if(x >= bx && y >= by && x <= bx + bwidth && y <= by + bheight) {
			return this;
		}
		else {
			return null;
		}
	}

	public get isSelected(): boolean {
		return this.parent?.canvas.selectionManager.isSelected(this) ?? false;
	}

	public get isFocused(): boolean {
		return this.parent?.canvas.selectionManager.isFocused(this) ?? false;
	}

	public get cursor(): Cursor {
		if(this.mIsMoving) {
			return Cursor.MOVE;
		}
		else {
			return Cursor.TEXT;
		}
	}

	public doAction(_x: number, _y: number): void {
		/*
		 * This.parent?.canvas.domManager.textEditor.showTextEditor(this.text, this.onTextEdited.bind(this), {
		 * x: this.x, y: this.y, width: this.width, height: this.height,
		 * font: `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${this.fontSize}px /${this.lineHeight} ${this.fontFamily}`,
		 * fontColor: this.fillStyle, textAlign: this.textAlign,
		 * multiline: true
		 * });
		 */

		this.parent?.canvas.domManager.settingsPopup.showSettingsPopup('Label', this.onSettingsChanged.bind(this), {
			groups: [
				{
					name: 'Label',
					elements: [
						{ type: 'text' as const, id: 'LABEL1', label: 'Label', value: '', disabled: false },
						{ type: 'number' as const, id: 'LABEL2', label: 'Label', value: 0 },
						{ type: 'color' as const, id: 'LABEL3', label: 'Label', value: '#FF0000', disabled: false },
						{ type: 'range' as const, id: 'LABEL4', label: 'Label', value: 0, min: 0, max: 100 },
						{ type: 'checkbox' as const, id: 'LABEL5', label: 'Label', checked: true },
						{
							type: 'radio' as const,
							id: 'LABEL6',
							radios: [
								{ label: 'Label', value: 'label1' },
								{ label: 'Label', value: 'label2', checked: true },
								{ label: 'Label', value: 'label3' }
							]
						},
						{
							type: 'select' as const,
							id: 'LABEL6',
							label: 'Label',
							options: [
								{ label: 'Label', value: 'label1' },
								{ label: 'Label', value: 'label2', selected: true },
								{ label: 'Label', value: 'label3' }
							]
						}
					]
				}
			]
		});
	}

	public get text(): string {
		return this.mText;
	}

	public set text(value: string) {
		this.mText = value;
		this.invalidate();
	}

	public startMove(x: number, y: number): void {
		this.mTempBox = { ...this.boundingBox };
		this.mIsMoving = true;
		this.mMoveStartX = x;
		this.mMoveStartY = y;
		this.invalidate();
	}

	public moveTo(x: number, y: number): void {
		this.mTempBox.x = this.mX + x - this.mMoveStartX;
		this.mTempBox.y = this.mY + y - this.mMoveStartY;
		this.invalidate();
	}

	public finishMove(x: number, y: number): void {
		this.mTempBox.x = this.mX + x - this.mMoveStartX;
		this.mTempBox.y = this.mY + y - this.mMoveStartY;
		this.mX = this.mTempBox.x;
		this.mY = this.mTempBox.y;
		this.mWidth = this.mTempBox.width;
		this.mHeight = this.mTempBox.height;
		this.mIsMoving = false;
		this.invalidate();
	}

	public cancelMove(): void {
		this.mIsMoving = false;
		this.invalidate();
	}

	public validateMoveTo(x: number, y: number): { x: number; y: number } {
		return { x, y };
	}

	private onTextEdited(text: string): void {
		this.text = text;
	}

	private resize(c: CanvasRenderingContext2D): void {
		if(!this.mShouldResize) return;

		c.font = `${this.mFontStyle} ${this.mFontVariant} ${this.mFontWeight} ${this.mFontSize}px /${this.mLineHeight} ${this.mFontFamily}`;
		const lineHeight = this.mFontSize * this.mLineHeight;
		const lines = this.text.split('\n');

		let width = 0;
		let height = 0;
		for(const line of lines) {
			width = Math.max(c.measureText(line).width, width);
			height += lineHeight;
		}

		if(this.mMinWidth !== null) width = Math.max(width, this.mMinWidth);
		if(this.mMaxWidth !== null) width = Math.min(width, this.mMaxWidth);
		if(this.mMinHeight !== null) height = Math.max(height, this.mMinHeight);
		if(this.mMaxHeight !== null) height = Math.min(height, this.mMaxHeight);

		this.mWidth = width;
		this.mHeight = height;
	}

	private onSettingsChanged(groups: SettingsGroups[]): void {
		console.log(groups);
	}
}
