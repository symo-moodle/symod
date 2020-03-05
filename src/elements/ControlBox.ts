import { BaseElement, BoundingBox } from './BaseElement';
import { ControlPoint, ControlPointCursor, IControlPointHost } from './ControlPoint';

export interface IControlBoxHost {
	readonly boundingBox: BoundingBox;
	controlBoxValidateSizing(width: number, height: number): { width: number; height: number };
	controlBoxStartedResize(controlBox: ControlBox): void;
	controlBoxResizedTo(controlBox: ControlBox): void;
	controlBoxFinishedResize(controlBox: ControlBox): void;
	controlBoxCanceledResize(controlBox: ControlBox): void;
}

export class ControlBox extends BaseElement implements IControlPointHost {
	private readonly mHost: IControlBoxHost;

	private readonly mTopLeft: ControlPoint;
	private readonly mTop: ControlPoint;
	private readonly mTopRight: ControlPoint;
	private readonly mLeft: ControlPoint;
	private readonly mRight: ControlPoint;
	private readonly mBottomLeft: ControlPoint;
	private readonly mBottom: ControlPoint;
	private readonly mBottomRight: ControlPoint;

	private mControlPointStartedMovePropagationLock: boolean;
	private mControlPointMovedToPropagationLock: boolean;
	private mControlPointFinishedMovePropagationLock: boolean;
	private mControlPointCanceledMovePropagationLock: boolean;

	public constructor(host: IControlBoxHost & BaseElement, options: { radius?: number; boundingBox: BoundingBox }) {
		if(host.parent === null) throw new Error('parent can only be null for the root stage');
		else super(host.parent);

		this.mHost = host;
		const { x, y, width, height } = options.boundingBox;
		const radius = options.radius ?? ControlPoint.CONTROLPOINT_RADIUS;

		this.mTopLeft = new ControlPoint(this, x, y, { radius: radius, cursor: ControlPointCursor.TOP_LEFT });
		this.mTop = new ControlPoint(this, x + (width / 2), y, { radius: radius, cursor: ControlPointCursor.TOP });
		this.mTopRight = new ControlPoint(this, x + width, y, { radius: radius, cursor: ControlPointCursor.TOP_RIGHT });
		this.mLeft = new ControlPoint(this, x, y + (height / 2), { radius: radius, cursor: ControlPointCursor.LEFT });
		this.mRight = new ControlPoint(this, x + width, y + (height / 2), {
			radius: radius,
			cursor: ControlPointCursor.RIGHT
		});
		this.mBottomLeft = new ControlPoint(this, x, y + height, {
			radius: radius,
			cursor: ControlPointCursor.BOTTOM_LEFT
		});
		this.mBottom = new ControlPoint(this, x + (width / 2), y + height, {
			radius: radius,
			cursor: ControlPointCursor.BOTTOM
		});
		this.mBottomRight = new ControlPoint(this, x + width, y + height, {
			radius: radius,
			cursor: ControlPointCursor.BOTTOM_RIGHT
		});

		this.mControlPointStartedMovePropagationLock = false;
		this.mControlPointMovedToPropagationLock = false;
		this.mControlPointFinishedMovePropagationLock = false;
		this.mControlPointCanceledMovePropagationLock = false;
	}

	public controlPointStartedMove(controlPoint: ControlPoint): void {
		if(!this.mControlPointStartedMovePropagationLock) {
			this.mControlPointStartedMovePropagationLock = true;

			this.controlPointMovingAction(controlPoint, ControlPoint.prototype.startMove);
			this.mHost.controlBoxStartedResize(this);

			this.mControlPointStartedMovePropagationLock = false;
		}
	}

	public controlPointMovedTo(controlPoint: ControlPoint): void {
		if(!this.mControlPointMovedToPropagationLock) {
			this.mControlPointMovedToPropagationLock = true;

			this.controlPointMovingAction(controlPoint, ControlPoint.prototype.moveTo);
			this.mHost.controlBoxResizedTo(this);

			this.mControlPointMovedToPropagationLock = false;
		}
	}

	public controlPointFinishedMove(controlPoint: ControlPoint): void {
		if(!this.mControlPointFinishedMovePropagationLock) {
			this.mControlPointFinishedMovePropagationLock = true;

			this.controlPointMovingAction(controlPoint, ControlPoint.prototype.finishMove);
			this.mHost.controlBoxFinishedResize(this);

			this.mControlPointFinishedMovePropagationLock = false;
		}
	}

	public controlPointCanceledMove(_controlPoint: ControlPoint): void {
		if(!this.mControlPointCanceledMovePropagationLock) {
			this.mControlPointCanceledMovePropagationLock = true;

			for(const controlPoint of this.controlPoints) {
				controlPoint.cancelMove();
			}
			this.mHost.controlBoxCanceledResize(this);

			this.mControlPointCanceledMovePropagationLock = false;
		}
	}

	public startMove(boundingBox: BoundingBox): void {
		this.mControlPointStartedMovePropagationLock = true;
		this.moveControlBoxTo(boundingBox, ControlPoint.prototype.startMove);
		this.mControlPointStartedMovePropagationLock = false;
	}

	public moveTo(boundingBox: BoundingBox): void {
		this.mControlPointMovedToPropagationLock = true;
		this.moveControlBoxTo(boundingBox, ControlPoint.prototype.moveTo);
		this.mControlPointMovedToPropagationLock = false;
	}

	public finishMove(boundingBox: BoundingBox): void {
		this.mControlPointFinishedMovePropagationLock = true;
		this.moveControlBoxTo(boundingBox, ControlPoint.prototype.finishMove);
		this.mControlPointFinishedMovePropagationLock = false;
	}

	public cancelMove(): void {
		this.mControlPointCanceledMovePropagationLock = true;
		for(const controlPoint of this.controlPoints) {
			controlPoint.cancelMove();
		}
		this.mControlPointCanceledMovePropagationLock = false;
	}

	public draw(c: CanvasRenderingContext2D): void {
		const { x, y, width, height } = this.boundingBox;

		c.strokeStyle = BaseElement.SELECTED_STROKESTYLE;
		c.strokeRect(x, y, width, height);
		for(const controlPoint of this.controlPoints) {
			controlPoint.draw(c);
		}
	}

	public get boundingBox(): BoundingBox {
		return {
			x: this.mTopLeft.x,
			y: this.mTopLeft.y,
			width: this.mBottomRight.x - this.mTopLeft.x,
			height: this.mBottomRight.y - this.mTopLeft.y
		};
	}

	public getElementUnderPosition(x: number, y: number): BaseElement | null {
		for(const controlPoint of this.controlPoints) {
			const el = controlPoint.getElementUnderPosition(x, y);
			if(el !== null) {
				return el;
			}
		}
		return null;
	}

	private controlPointMovingAction(
		controlPoint: ControlPoint | null,
		movingAction: (x: number, y: number) => void
	): void {
		let topX = Math.min(this.mTopLeft.x, this.mLeft.x, this.mBottomLeft.x);
		let topY = Math.min(this.mTopLeft.y, this.mTop.y, this.mTopRight.y);
		let bottomX = Math.max(this.mTopRight.x, this.mRight.x, this.mBottomRight.x);
		let bottomY = Math.max(this.mBottomLeft.y, this.mBottom.y, this.mBottomRight.y);

		if(controlPoint === this.mTopLeft) {
			topX = Math.min(this.mTopLeft.x, bottomX);
			topY = Math.min(this.mTopLeft.y, bottomY);
		}
		else if(controlPoint === this.mTop) {
			topY = Math.min(this.mTop.y, bottomY);
		}
		else if(controlPoint === this.mTopRight) {
			bottomX = Math.max(this.mTopRight.x, topX);
			topY = Math.min(this.mTopRight.y, bottomY);
		}
		else if(controlPoint === this.mLeft) {
			topX = Math.min(this.mLeft.x, bottomX);
		}
		else if(controlPoint === this.mRight) {
			bottomX = Math.max(this.mRight.x, topX);
		}
		else if(controlPoint === this.mBottomLeft) {
			topX = Math.min(this.mBottomLeft.x, bottomX);
			bottomY = Math.max(this.mBottomLeft.y, topY);
		}
		else if(controlPoint === this.mBottom) {
			bottomY = Math.max(this.mBottom.y, topY);
		}
		else if(controlPoint === this.mBottomRight) {
			bottomX = Math.max(this.mBottomRight.x, topX);
			bottomY = Math.max(this.mBottomRight.y, topY);
		}

		const { width: newWidth, height: newHeight } = this.mHost.controlBoxValidateSizing(
			bottomX - topX,
			bottomY - topY
		);

		if(controlPoint === this.mTopLeft) {
			topX = bottomX - newWidth;
			topY = bottomY - newHeight;
		}
		else if(controlPoint === this.mTop) {
			[topX, bottomX] = [(topX + bottomX - newWidth) / 2, (topX + bottomX + newWidth) / 2];
			topY = bottomY - newHeight;
		}
		else if(controlPoint === this.mTopRight) {
			bottomX = topX + newWidth;
			topY = bottomY - newHeight;
		}
		else if(controlPoint === this.mLeft) {
			topX = bottomX - newWidth;
			[topY, bottomY] = [(topY + bottomY - newHeight) / 2, (topY + bottomY + newHeight) / 2];
		}
		else if(controlPoint === this.mRight) {
			bottomX = topX + newWidth;
			[topY, bottomY] = [(topY + bottomY - newHeight) / 2, (topY + bottomY + newHeight) / 2];
		}
		else if(controlPoint === this.mBottomLeft) {
			topX = bottomX - newWidth;
			bottomY = topY + newHeight;
		}
		else if(controlPoint === this.mBottom) {
			[topX, bottomX] = [(topX + bottomX - newWidth) / 2, (topX + bottomX + newWidth) / 2];
			bottomY = topY + newHeight;
		}
		else if(controlPoint === this.mBottomRight) {
			bottomX = topX + newWidth;
			bottomY = topY + newHeight;
		}

		movingAction.call(this.mTopLeft, topX, topY);
		movingAction.call(this.mTop, (topX + bottomX) / 2, topY);
		movingAction.call(this.mTopRight, bottomX, topY);
		movingAction.call(this.mLeft, topX, (topY + bottomY) / 2);
		movingAction.call(this.mRight, bottomX, (topY + bottomY) / 2);
		movingAction.call(this.mBottomLeft, topX, bottomY);
		movingAction.call(this.mBottom, (topX + bottomX) / 2, bottomY);
		movingAction.call(this.mBottomRight, bottomX, bottomY);

		this.invalidate();
	}

	private moveControlBoxTo(boundingBox: BoundingBox, movingAction: (x: number, y: number) => void): void {
		const { x, y, width, height } = boundingBox;
		movingAction.call(this.mTopLeft, x, y);
		movingAction.call(this.mTop, x + (width / 2), y);
		movingAction.call(this.mTopRight, x + width, y);
		movingAction.call(this.mLeft, x, y + (height / 2));
		movingAction.call(this.mRight, x + width, y + (height / 2));
		movingAction.call(this.mBottomLeft, x, y + height);
		movingAction.call(this.mBottom, x + (width / 2), y + height);
		movingAction.call(this.mBottomRight, x + width, y + height);
	}

	private get controlPoints(): ControlPoint[] {
		return [
			this.mTopLeft,
			this.mTop,
			this.mTopRight,
			this.mLeft,
			this.mRight,
			this.mBottomLeft,
			this.mBottom,
			this.mBottomRight
		];
	}
}
