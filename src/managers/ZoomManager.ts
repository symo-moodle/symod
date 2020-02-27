import { GraphEditor } from '../GraphEditor';

export interface IZoomManagerOptions {
	zoom?: number;
}

export class ZoomManager {
	private readonly mGraphEditor: GraphEditor;
	private mZoom: number;

	public constructor(graphEditor: GraphEditor, options?: IZoomManagerOptions) {
		this.mGraphEditor = graphEditor;

		this.mZoom = options?.zoom ?? 1;
	}

	public get zoom(): number {
		return this.mZoom;
	}

	public set zoom(value: number) {
		this.mZoom = value;
	}
}
