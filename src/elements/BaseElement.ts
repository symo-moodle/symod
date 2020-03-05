import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';
import { Stage } from './Stage';

export type BoundingBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export abstract class BaseElement extends Base {
	public static readonly SELECTED_FILLSTYLE: string = '#0000FF';
	public static readonly SELECTED_STROKESTYLE: string = '#0000FF';

	private readonly mParent: Stage | null;

	public constructor(parent: Stage | GraphEditor) {
		super(parent instanceof GraphEditor ? parent : parent.graphEditor);
		this.mParent = parent instanceof GraphEditor ? null : parent;
	}

	public get parent(): Stage | null {
		return this.mParent;
	}

	public invalidate(): void {
		if(this.parent !== null) {
			this.parent.invalidate();
		}
	}

	public abstract draw(c: CanvasRenderingContext2D): void;

	public abstract get boundingBox(): BoundingBox;

	public abstract getElementUnderPosition(x: number, y: number): BaseElement | null;
}
