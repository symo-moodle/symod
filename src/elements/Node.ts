import { Element, BoundingBox } from './Element';
import { Stage } from './Stage';
import { ISelectable } from '../tools/Selector';
import { Cursor } from '../utils/Cursor';
import { ControlBox, IControlBoxHost } from './ControlBox';

export class Node extends Element implements ISelectable, IControlBoxHost {
	private box: BoundingBox;
	private controlBox: ControlBox;

	private isResizing: boolean;
	private resizeBox: BoundingBox;

	public constructor(parent: Stage, options: { boundingBox: BoundingBox }) {
		super(parent);
		this.box = options.boundingBox;
		this.controlBox = new ControlBox(this, { boundingBox: this.box });

		this.isResizing = false;
		this.resizeBox = this.box;
	}

	public getElementUnderPosition(mx: number, my: number): Element | null {
		const { x, y, width, height } = this.boundingBox;
		if (this.isSelected) {
			const controlBoxSelection = this.controlBox.getElementUnderPosition(mx, my);
			if (controlBoxSelection != null) return controlBoxSelection;
		}
		if (mx >= x && my >= y && mx <= x + width && my <= y + height) return this;
		else return null;
	}

	public get boundingBox(): BoundingBox {
		return this.box;
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.strokeStyle = 'grey';
		c.fillStyle = 'grey';
		const { x, y, width, height } = this.isResizing ? this.resizeBox : this.boundingBox;
		c.fillRect(x, y, width, height);

		if (this.isSelected) {
			this.controlBox.draw(c);
		}
	}

	public get isSelected(): boolean {
		return this.parent?.canvas.selectionManager.isSelected(this) || false;
	}

	public get isFocused(): boolean {
		return this.parent?.canvas.selectionManager.isFocused(this) || false;
	}

	public get cursor(): Cursor {
		return Cursor.DEFAULT;
	}

	public controlBoxValidateSizing(width: number, height: number): { width: number; height: number } {
		return { width, height };
	}

	public controlBoxStartedResize(controlBox: ControlBox): void {
		this.isResizing = true;
		this.resizeBox = controlBox.boundingBox;
		this.invalidate();
	}

	public controlBoxResizedTo(controlBox: ControlBox): void {
		this.resizeBox = controlBox.boundingBox;
		this.invalidate();
	}

	public controlBoxFinishedResize(controlBox: ControlBox): void {
		this.isResizing = false;
		this.box = controlBox.boundingBox;
		this.invalidate();
	}

	public controlBoxCanceledResize(_controlBox: ControlBox): void {
		this.isResizing = false;
		this.invalidate();
	}
}
