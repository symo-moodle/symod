import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';

export interface IZoomManagerOptions {
	zoom?: number;
}

export class ZoomManager extends Base {
	private mZoom: number;

	public constructor(graphEditor: GraphEditor, options?: IZoomManagerOptions) {
		super(graphEditor);

		this.mZoom = options?.zoom ?? 1;
	}

	public get zoom(): number {
		return this.mZoom >= 1 ? this.mZoom : -(1 / (this.mZoom - 2));
	}

	public zoomIn(): void {
		this.mZoom += 1;
		this.graphEditor.canvasManager.invalidate();
		this.graphEditor.domManager.zoomAdjust();
	}

	public zoomOut(): void {
		this.mZoom -= 1;
		this.graphEditor.canvasManager.invalidate();
		this.graphEditor.domManager.zoomAdjust();
	}
}
