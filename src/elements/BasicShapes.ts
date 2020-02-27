/* eslint-disable max-classes-per-file */

import { ILabelHost, Label } from './Label';
import { BoundingBox } from './Element';
import { ControlPoint } from './ControlPoint';
import { Node } from './Node';
import { Stage } from './Stage';

export interface IBasicShapeOptions {
	fillStyle?:
		| string
		| {
				gradient: 'lr-gradient' | 'rl-gradient' | 'td-gradient' | 'bu-gradient' | 'r-gradient';
				stops: { stop: number; color: string }[];
		  };

	strokeStyle?: string;
	lineWidth?: number;
	lineCap?: 'butt' | 'round' | 'square';
	lineJoin?: 'round' | 'bevel' | 'miter';
	miterLimit?: number;
	lineDash?: number[];
	lineDashOffset?: number;

	shadowBlur?: number;
	shadowColor?: string;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
}

export abstract class BasicShape extends Node {
	private readonly mFillStyle:
		| string
		| {
				gradient: 'lr-gradient' | 'rl-gradient' | 'td-gradient' | 'bu-gradient' | 'r-gradient';
				stops: { stop: number; color: string }[];
		  };

	private readonly mStrokeStyle: string;
	private readonly mLineWidth: number;
	private readonly mLineCap: 'butt' | 'round' | 'square';
	private readonly mLineJoin: 'round' | 'bevel' | 'miter';
	private readonly mMiterLimit: number;
	private readonly mLineDash: number[];
	private readonly mLineDashOffset: number;

	private readonly mShadowBlur: number;
	private readonly mShadowColor: string;
	private readonly mShadowOffsetX: number;
	private readonly mShadowOffsetY: number;

	public constructor(parent: Stage, options: { boundingBox: BoundingBox } & IBasicShapeOptions) {
		super(parent, { boundingBox: options.boundingBox });

		this.mFillStyle = options.fillStyle ?? '#d3d3d3';

		this.mStrokeStyle = options.strokeStyle ?? '#a9a9a9';
		this.mLineWidth = options.lineWidth ?? 1;
		this.mLineCap = options.lineCap ?? 'butt';
		this.mLineJoin = options.lineJoin ?? 'round';
		this.mMiterLimit = options.miterLimit ?? 10; // eslint-disable-line no-magic-numbers
		this.mLineDash = options.lineDash ?? [];
		this.mLineDashOffset = options.lineDashOffset ?? 0;

		this.mShadowBlur = options.shadowBlur ?? 0;
		this.mShadowColor = options.shadowColor ?? 'black';
		this.mShadowOffsetX = options.shadowOffsetX ?? 0;
		this.mShadowOffsetY = options.shadowOffsetY ?? 0;
	}

	protected setupCanvasContext(c: CanvasRenderingContext2D): void {
		c.save();

		if(typeof this.mFillStyle === 'string') {
			c.fillStyle = this.mFillStyle;
		}
		else {
			const { x, y, width, height } = this.boundingBox;
			let gradient!: CanvasGradient;
			switch(this.mFillStyle.gradient) {
				case 'lr-gradient':
					gradient = c.createLinearGradient(x, y + (height / 2), x + width, y + (height / 2));
					break;
				case 'rl-gradient':
					gradient = c.createLinearGradient(x + width, y + (height / 2), x, y + (height / 2));
					break;
				case 'td-gradient':
					gradient = c.createLinearGradient(x + (width / 2), y, x + (width / 2), y + height);
					break;
				case 'bu-gradient':
					gradient = c.createLinearGradient(x + (width / 2), y + height, x + (width / 2), y);
					break;
				case 'r-gradient':
					gradient = c.createRadialGradient(
						x + (width / 2),
						y + (height / 2),
						Math.min(width, height) / 2,
						x + (width / 2),
						y + (height / 2),
						Math.min(width, height)
					);
					break;
			}
			this.mFillStyle.stops.forEach((stop) => {
				gradient.addColorStop(stop.stop, stop.color);
			});
			c.fillStyle = gradient;
		}

		c.strokeStyle = this.mStrokeStyle;
		c.lineWidth = this.mLineWidth;
		c.lineCap = this.mLineCap;
		c.lineJoin = this.mLineJoin;
		c.miterLimit = this.mMiterLimit;
		c.setLineDash(this.mLineDash);
		c.lineDashOffset = this.mLineDashOffset;

		c.shadowBlur = this.mShadowBlur;
		c.shadowColor = this.mShadowColor;
		c.shadowOffsetX = this.mShadowOffsetX;
		c.shadowOffsetY = this.mShadowOffsetY;
	}

	protected tearDownCanvasContext(c: CanvasRenderingContext2D): void {
		c.restore();
	}
}

export interface IRectOptions {
	x: number;
	y: number;
	width: number;
	height: number;
}

export class Rect extends BasicShape implements ILabelHost {
	private mX: number;
	private mY: number;
	private mWidth: number;
	private mHeight: number;

	public constructor(parent: Stage, options: IRectOptions & IBasicShapeOptions) {
		super(parent, {
			boundingBox: {
				x: options.x - ControlPoint.CONTROLPOINT_RADIUS,
				y: options.y - ControlPoint.CONTROLPOINT_RADIUS,
				width: options.width + (2 * ControlPoint.CONTROLPOINT_RADIUS),
				height: options.height + (2 * ControlPoint.CONTROLPOINT_RADIUS)
			},
			...options
		});

		this.mX = options.x;
		this.mY = options.y;
		this.mWidth = options.width;
		this.mHeight = options.height;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onLabelChanged(_label: Label): void {
	}

	public getLabelOwnershipHintLocation(_x: number, _y: number): { x: number; y: number } {
		return {
			x: this.mX + (this.mWidth / 2),
			y: this.mY + (this.mHeight / 2)
		};
	}

	public draw(c: CanvasRenderingContext2D): void {
		super.draw(c);
		this.setupCanvasContext(c);

		c.fillRect(this.mX, this.mY, this.mWidth, this.mHeight);
		c.strokeRect(this.mX, this.mY, this.mWidth, this.mHeight);

		this.tearDownCanvasContext(c);
	}

	protected onBoundingBoxChanged(): void {
		const { x, y, width, height } = this.boundingBox;
		this.mX = x + ControlPoint.CONTROLPOINT_RADIUS;
		this.mY = y + ControlPoint.CONTROLPOINT_RADIUS;
		this.mWidth = width - (2 * ControlPoint.CONTROLPOINT_RADIUS);
		this.mHeight = height - (2 * ControlPoint.CONTROLPOINT_RADIUS);
		this.invalidate();
	}
}
