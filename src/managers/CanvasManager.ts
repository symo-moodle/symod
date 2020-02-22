import { GraphEditor } from '../GraphEditor';
import { Stage } from '../elements/Stage';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICanvasManagerOptions {}

export class CanvasManager {
	private graphEditor: GraphEditor;

	private width: number;
	private height: number;

	private _rootStage: Stage;
	private animationFrameHandle: number | undefined;
	private redrawNeeded = true;

	public constructor(graphEditor: GraphEditor, _options?: ICanvasManagerOptions) {
		this.graphEditor = graphEditor;

		this.width = this.height = 0;
		this._rootStage = new Stage(this.graphEditor);
	}

	public resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this._rootStage.resize(this.width, this.height);
		this.invalidate();
	}

	public invalidate(): void {
		this.redrawNeeded = true;
	}

	public startCanvas(): void {
		this.scheduleRedraw();
	}

	public destroyCanvas(): void {
		if (this.animationFrameHandle) window.cancelAnimationFrame(this.animationFrameHandle);
	}

	public get rootStage(): Stage {
		return this._rootStage;
	}

	private draw(): void {
		if (this.redrawNeeded) {
			const c = this.graphEditor.domManager.canvasContext;
			const zoom = this.graphEditor.zoomManager.zoom;

			c.clearRect(0, 0, this.width, this.height);
			c.save();
			c.scale(zoom, zoom);
			this._rootStage.draw(c);
			c.restore();
			this.redrawNeeded = false;
		}
	}

	private scheduleRedraw(): void {
		this.draw();
		this.animationFrameHandle = window.requestAnimationFrame(this.scheduleRedraw.bind(this));
	}
}
