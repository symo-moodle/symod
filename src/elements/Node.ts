import { BaseElement, BoundingBox } from './BaseElement';
import { ControlBox, IControlBoxHost } from './ControlBox';
import { IMovable, ISelectable } from '../tools/Selector';
import { Cursor } from '../utils/Cursor';
import { Stage } from './Stage';

export abstract class BaseNode extends BaseElement implements ISelectable, IMovable, IControlBoxHost {
	private mBox: BoundingBox;
	private readonly mControlBox: ControlBox;

	private mIsResizing: boolean;
	private mIsMoving: boolean;
	private mMoveStartX: number;
	private mMoveStartY: number;
	private mTempBox: BoundingBox;

	public constructor(parent: Stage, options: { boundingBox: BoundingBox }) {
		super(parent);
		this.mBox = options.boundingBox;
		this.mControlBox = new ControlBox(this, { boundingBox: this.mBox });

		this.mIsResizing = false;
		this.mIsMoving = false;
		this.mMoveStartX = 0;
		this.mMoveStartY = 0;
		this.mTempBox = { ...this.mBox };
	}

	public getElementUnderPosition(mx: number, my: number): BaseElement | null {
		const { x, y, width, height } = this.boundingBox;
		if(this.isSelected) {
			const controlBoxSelection = this.mControlBox.getElementUnderPosition(mx, my);
			if(controlBoxSelection !== null) return controlBoxSelection;
		}
		if(mx >= x && my >= y && mx <= x + width && my <= y + height) return this;
		else return null;
	}

	public get boundingBox(): BoundingBox {
		return this.mIsResizing || this.mIsMoving ? this.mTempBox : this.mBox;
	}

	public draw(c: CanvasRenderingContext2D): void {
		if(this.isSelected) {
			this.mControlBox.draw(c);
		}
	}

	public get isSelected(): boolean {
		return this.parent?.graphEditor.selectionManager.isSelected(this) ?? false;
	}

	public get isFocused(): boolean {
		return this.parent?.graphEditor.selectionManager.isFocused(this) ?? false;
	}

	public get cursor(): Cursor {
		if(this.isSelected || this.mIsMoving) {
			return Cursor.MOVE;
		}
		else {
			return Cursor.DEFAULT;
		}
	}

	public controlBoxValidateSizing(width: number, height: number): { width: number; height: number } {
		return { width, height };
	}

	public controlBoxStartedResize(controlBox: ControlBox): void {
		this.mIsResizing = true;
		this.mTempBox = controlBox.boundingBox;
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public controlBoxResizedTo(controlBox: ControlBox): void {
		this.mTempBox = controlBox.boundingBox;
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public controlBoxFinishedResize(controlBox: ControlBox): void {
		this.mIsResizing = false;
		this.mBox = controlBox.boundingBox;
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public controlBoxCanceledResize(_controlBox: ControlBox): void {
		this.mIsResizing = false;
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public startMove(x: number, y: number): void {
		this.mTempBox = { ...this.boundingBox };
		this.mIsMoving = true;
		this.mMoveStartX = x;
		this.mMoveStartY = y;
		this.mControlBox.startMove(this.mTempBox);
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public moveTo(x: number, y: number): void {
		const { x: nx, y: ny } = this.validateMoveTo(
			this.mBox.x + x - this.mMoveStartX,
			this.mBox.y + y - this.mMoveStartY
		);
		this.mTempBox.x = nx;
		this.mTempBox.y = ny;
		this.mControlBox.moveTo(this.mTempBox);
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public finishMove(x: number, y: number): void {
		this.mIsMoving = false;
		const { x: nx, y: ny } = this.validateMoveTo(
			this.mBox.x + x - this.mMoveStartX,
			this.mBox.y + y - this.mMoveStartY
		);
		this.mTempBox.x = nx;
		this.mTempBox.y = ny;
		this.mBox = { ...this.mTempBox };
		this.mControlBox.finishMove(this.mBox);
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public cancelMove(): void {
		this.mIsMoving = false;
		this.mControlBox.cancelMove();
		this.onBoundingBoxChanged();
		this.invalidate();
	}

	public validateMoveTo(x: number, y: number): { x: number; y: number } {
		return { x, y };
	}

	protected abstract onBoundingBoxChanged(): void;
}
