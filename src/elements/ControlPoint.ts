import { Element, BoundingBox } from './Element';
import { Cursor } from '../utils/Cursor';
import { IMovable } from '../tools/Selector';

export enum ControlPointCursor {
	TOP_LEFT = 1,
	TOP,
	TOP_RIGHT,
	LEFT,
	MOVE,
	RIGHT,
	BOTTOM_LEFT,
	BOTTOM,
	BOTTOM_RIGHT,
}

export interface IControlPointHost {
	controlPointStartedMove(controlPoint: ControlPoint): void;
	controlPointMovedTo(controlPoint: ControlPoint): void;
	controlPointFinishedMove(controlPoint: ControlPoint): void;
	controlPointCanceledMove(controlPoint: ControlPoint): void;
}

export class ControlPoint extends Element implements IMovable {
	public static readonly CONTROLPOINT_RADIUS: number = 6;

	private _x: number;
	private _y: number;
	private radius: number;

	private host: IControlPointHost;
	private _cursor: ControlPointCursor;

	private isMoving: boolean;
	private movingX: number;
	private movingY: number;

	public constructor(
		host: IControlPointHost & Element,
		x: number,
		y: number,
		options?: { radius?: number; cursor?: ControlPointCursor },
	) {
		super(host.parent);
		this.host = host;

		this._x = this.movingX = x;
		this._y = this.movingY = y;
		this.radius = options?.radius || ControlPoint.CONTROLPOINT_RADIUS;

		this._cursor = options?.cursor || ControlPointCursor.MOVE;

		this.isMoving = false;
	}

	public get cursor(): Cursor {
		switch (this._cursor) {
			case ControlPointCursor.TOP_LEFT:
				return Cursor.NW_RESIZE;
			case ControlPointCursor.TOP:
				return Cursor.N_RESIZE;
			case ControlPointCursor.TOP_RIGHT:
				return Cursor.NE_RESIZE;
			case ControlPointCursor.LEFT:
				return Cursor.W_RESIZE;
			case ControlPointCursor.MOVE:
				return Cursor.MOVE;
			case ControlPointCursor.RIGHT:
				return Cursor.E_RESIZE;
			case ControlPointCursor.BOTTOM_LEFT:
				return Cursor.SW_RESIZE;
			case ControlPointCursor.BOTTOM:
				return Cursor.S_RESIZE;
			case ControlPointCursor.BOTTOM_RIGHT:
				return Cursor.SE_RESIZE;
		}
	}

	public get x(): number {
		return this.isMoving ? this.movingX : this._x;
	}

	public get y(): number {
		return this.isMoving ? this.movingY : this._y;
	}

	public startMove(x: number, y: number): void {
		this.isMoving = true;
		this.movingX = x;
		this.movingY = y;
		this.host.controlPointStartedMove(this);
		this.invalidate();
	}

	public moveTo(x: number, y: number): void {
		this.movingX = x;
		this.movingY = y;
		this.host.controlPointMovedTo(this);
		this.invalidate();
	}

	public finishMove(x: number, y: number): void {
		this.isMoving = false;
		this._x = x;
		this._y = y;
		this.host.controlPointFinishedMove(this);
		this.invalidate();
	}

	public cancelMove(): void {
		this.isMoving = false;
		this.host.controlPointCanceledMove(this);
		this.invalidate();
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.strokeStyle = Element.SELECTED_STROKESTYLE;
		c.fillStyle = Element.SELECTED_FILLSTYLE;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		c.fill();
		c.stroke();
	}

	public get boundingBox(): BoundingBox {
		return { x: this.x - this.radius, y: this.y - this.radius, width: 2 * this.radius, height: 2 * this.radius };
	}

	public getElementUnderPosition(x: number, y: number): Element | null {
		if (Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.radius, 2)) {
			return this;
		} else return null;
	}
}
