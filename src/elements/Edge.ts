import { BaseElement } from './BaseElement';

export class Edge extends BaseElement {
	public getElementUnderPosition(_x: number, _y: number): BaseElement {
		throw new Error('Method not implemented.');
	}

	public get boundingBox(): { x: number; y: number; width: number; height: number } {
		throw new Error('Method not implemented.');
	}

	public draw(_c: CanvasRenderingContext2D): void {
		throw new Error('Method not implemented.');
	}
}
