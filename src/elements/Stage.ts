import { Element } from './Element';
import { GraphEditor } from '../GraphEditor';

export class Stage extends Element {
	private width: number;
	private height: number;

	private _owner: Element | GraphEditor;
	private _elements: Element[];

	public constructor(parent: Element | GraphEditor, options?: { width: number; height: number }) {
		super(parent instanceof Element ? parent.parent : null);
		this.width = options?.width || 0;
		this.height = options?.height || 0;
		this._owner = parent;
		this._elements = [];
	}

	public resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.invalidate();
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.fillStyle = '#fefefe';
		c.strokeStyle = 'black solid';
		c.lineWidth = 1;
		c.fillRect(0, 0, this.width, this.height);
		c.strokeRect(0, 0, this.width, this.height);

		for (const element of this._elements) {
			element.draw(c);
		}
	}

	public invalidate(): void {
		if (this._owner instanceof Element) super.invalidate();
		else this._owner.canvasManager.invalidate();
	}

	public get canvas(): GraphEditor {
		if (this._owner instanceof GraphEditor) return this._owner;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		else return this._owner.parent!.canvas;
	}

	public addElement(element: Element): void {
		this._elements.push(element);
		this.invalidate();
	}

	public getElementUnderPosition(x: number, y: number): Element | null {
		for (const element of this._elements) {
			const el = element.getElementUnderPosition(x, y);
			if (el != null) {
				return el;
			}
		}
		return null;
	}

	public get boundingBox(): { x: number; y: number; width: number; height: number } {
		return { x: 0, y: 0, width: this.width, height: this.height };
	}
}
