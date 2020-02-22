import { Element } from './Element';

export class Edge extends Element {
	public getElementUnderPosition(_x: number, _y: number): Element {
		throw new Error('Method not implemented.');
	}
	public get boundingBox(): { x: number; y: number; width: number; height: number } {
		throw new Error('Method not implemented.');
	}
	public draw(_c: CanvasRenderingContext2D): void {
		throw new Error('Method not implemented.');
	}
}
