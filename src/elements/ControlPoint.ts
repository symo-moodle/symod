import { BoundingBox, Element } from './Element';
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
	// eslint-disable-next-line no-magic-numbers
	public static readonly CONTROLPOINT_RADIUS: number = 4;

	private mX: number;
	private mY: number;
	private readonly mRadius: number;

	private readonly mHost: IControlPointHost;
	private readonly mCursor: ControlPointCursor;

	private mIsMoving: boolean;
	private mMovingX: number;
	private mMovingY: number;

	public constructor(
		host: IControlPointHost & Element,
		x: number,
		y: number,
		options?: { radius?: number; cursor?: ControlPointCursor }
	) {
		super(host.parent);
		this.mHost = host;

		this.mX = x;
		this.mY = y;
		this.mMovingX = x;
		this.mMovingY = y;
		this.mRadius = options?.radius ?? ControlPoint.CONTROLPOINT_RADIUS;

		this.mCursor = options?.cursor ?? ControlPointCursor.MOVE;

		this.mIsMoving = false;
	}

	public get cursor(): Cursor {
		switch(this.mCursor) {
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
			default:
				throw new Error('No such cursor');
		}
	}

	public get x(): number {
		return this.mIsMoving ? this.mMovingX : this.mX;
	}

	public get y(): number {
		return this.mIsMoving ? this.mMovingY : this.mY;
	}

	public startMove(x: number, y: number): void {
		this.mIsMoving = true;
		this.mMovingX = x;
		this.mMovingY = y;
		this.mHost.controlPointStartedMove(this);
		this.invalidate();
	}

	public moveTo(x: number, y: number): void {
		this.mMovingX = x;
		this.mMovingY = y;
		this.mHost.controlPointMovedTo(this);
		this.invalidate();
	}

	public finishMove(x: number, y: number): void {
		this.mIsMoving = false;
		this.mX = x;
		this.mY = y;
		this.mHost.controlPointFinishedMove(this);
		this.invalidate();
	}

	public cancelMove(): void {
		this.mIsMoving = false;
		this.mHost.controlPointCanceledMove(this);
		this.invalidate();
	}

	public validateMoveTo(x: number, y: number): { x: number; y: number } {
		return { x, y };
	}

	public draw(c: CanvasRenderingContext2D): void {
		c.strokeStyle = Element.SELECTED_STROKESTYLE;
		c.fillStyle = Element.SELECTED_FILLSTYLE;
		c.beginPath();
		c.arc(this.x, this.y, this.mRadius, 0, Math.PI * 2);
		c.fill();
		c.stroke();
	}

	public get boundingBox(): BoundingBox {
		return {
			x: this.x - this.mRadius,
			y: this.y - this.mRadius,
			width: 2 * this.mRadius,
			height: 2 * this.mRadius
		};
	}

	public getElementUnderPosition(x: number, y: number): Element | null {
		if(((this.x - x) ** 2) + ((this.y - y) ** 2) <= this.mRadius ** 2) {
			return this;
		}
		else return null;
	}
}
