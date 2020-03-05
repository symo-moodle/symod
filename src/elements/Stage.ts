import { BaseElement } from './BaseElement';
import { GraphEditor } from '../GraphEditor';

export class Stage extends BaseElement {
	private readonly mStageGraphEditor: GraphEditor;
	private mWidth: number;
	private mHeight: number;

	private readonly mOwner: BaseElement | GraphEditor;
	private readonly mElements: BaseElement[];

	public constructor(parent: BaseElement | GraphEditor, options?: { width: number; height: number }) {
		if(parent instanceof BaseElement) {
			if(parent.parent === null) throw new Error('parent can only be null for the root stage');
			super(parent.parent.graphEditor);
			this.mStageGraphEditor = parent.parent.graphEditor;
		}
		else {
			super(parent);
			this.mStageGraphEditor = parent;
		}

		this.mWidth = options?.width ?? 0;
		this.mHeight = options?.height ?? 0;
		this.mOwner = parent;
		this.mElements = [];
	}

	public resize(width: number, height: number): void {
		this.mWidth = width;
		this.mHeight = height;
		this.invalidate();
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.fillStyle = '#fefefe';
		c.strokeStyle = 'black solid';
		c.lineWidth = 1;
		c.fillRect(0, 0, this.mWidth, this.mHeight);
		c.strokeRect(0, 0, this.mWidth, this.mHeight);

		for(const element of this.mElements) {
			element.draw(c);
		}
	}

	public invalidate(): void {
		if(this.mOwner instanceof BaseElement) super.invalidate();
		else this.mOwner.canvasManager.invalidate();
	}

	public get graphEditor(): GraphEditor {
		return this.mStageGraphEditor;
	}

	public addElement(element: BaseElement): void {
		this.mElements.push(element);
		this.invalidate();
	}

	public getElementUnderPosition(x: number, y: number): BaseElement | null {
		for(const element of [...this.mElements].reverse()) {
			const el = element.getElementUnderPosition(x, y);
			if(el !== null) {
				return el;
			}
		}
		return null;
	}

	public get boundingBox(): { x: number; y: number; width: number; height: number } {
		return { x: 0, y: 0, width: this.mWidth, height: this.mHeight };
	}
}
