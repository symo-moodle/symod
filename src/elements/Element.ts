import { Stage } from './Stage';

export type BoundingBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export abstract class Element {
	public static readonly SELECTED_FILLSTYLE: string = '#0000FF';
	public static readonly SELECTED_STROKESTYLE: string = '#0000FF';

	private readonly mParent: Stage | null;

	public constructor(parent: Stage | null) {
		this.mParent = parent;
	}

	public get parent(): Stage | null {
		return this.mParent;
	}

	public invalidate(): void {
		this.parent?.invalidate();
	}

	public abstract draw(c: CanvasRenderingContext2D): void;

	public abstract get boundingBox(): BoundingBox;

	public abstract getElementUnderPosition(x: number, y: number): Element | null;
}
