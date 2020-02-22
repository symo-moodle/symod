import { GraphEditor } from '../GraphEditor';

export interface IZoomManagerOptions {
	zoom?: number;
}

export class ZoomManager {
	private graphEditor: GraphEditor;
	private _zoom: number;

	public constructor(graphEditor: GraphEditor, options?: IZoomManagerOptions) {
		this.graphEditor = graphEditor;

		this._zoom = options?.zoom || 1;
	}

	public get zoom(): number {
		return this._zoom;
	}

	public set zoom(value: number) {
		this._zoom = value;
	}
}
