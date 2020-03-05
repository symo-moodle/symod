import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';
import { Stage } from '../elements/Stage';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICanvasManagerOptions {}

export class CanvasManager extends Base {
	private mWidth: number;
	private mHeight: number;

	private readonly mRootStage: Stage;
	private mAnimationFrameHandle: number | null;
	private mRedrawNeeded: boolean;

	public constructor(graphEditor: GraphEditor, _options?: ICanvasManagerOptions) {
		super(graphEditor);

		this.mWidth = 0;
		this.mHeight = 0;
		this.mRootStage = new Stage(this.graphEditor);
		this.mAnimationFrameHandle = null;
		this.mRedrawNeeded = true;
	}

	public resize(width: number, height: number): void {
		this.mWidth = width;
		this.mHeight = height;
		this.mRootStage.resize(this.mWidth, this.mHeight);
		this.invalidate();
	}

	public invalidate(): void {
		this.mRedrawNeeded = true;
	}

	public startCanvas(): void {
		this.scheduleRedraw();
	}

	public destroyCanvas(): void {
		if(this.mAnimationFrameHandle !== null) window.cancelAnimationFrame(this.mAnimationFrameHandle);
	}

	public get rootStage(): Stage {
		return this.mRootStage;
	}

	private draw(): void {
		if(this.mRedrawNeeded) {
			const c = this.graphEditor.domManager.canvasContext;
			const { zoom } = this.graphEditor.zoomManager;

			c.clearRect(0, 0, this.mWidth, this.mHeight);
			c.save();
			c.scale(zoom, zoom);
			this.mRootStage.draw(c);
			c.restore();
			this.mRedrawNeeded = false;
		}
	}

	private scheduleRedraw(): void {
		this.draw();
		this.mAnimationFrameHandle = window.requestAnimationFrame(this.scheduleRedraw.bind(this));
	}
}
