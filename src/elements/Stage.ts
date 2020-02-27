import { Element } from './Element';
import { GraphEditor } from '../GraphEditor';

export class Stage extends Element {
	private mWidth: number;
	private mHeight: number;

	private readonly mOwner: Element | GraphEditor;
	private readonly mElements: Element[];

	public constructor(parent: Element | GraphEditor, options?: { width: number; height: number }) {
		super(parent instanceof Element ? parent.parent : null);
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
		if(this.mOwner instanceof Element) super.invalidate();
		else this.mOwner.canvasManager.invalidate();
	}

	public get canvas(): GraphEditor {
		if(this.mOwner instanceof GraphEditor) return this.mOwner;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		else return this.mOwner.parent!.canvas;
	}

	public addElement(element: Element): void {
		this.mElements.push(element);
		this.invalidate();
	}

	public getElementUnderPosition(x: number, y: number): Element | null {
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
