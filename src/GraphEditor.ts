export * from './elements/ControlPoint';
export * from './elements/ControlBox';
export * from './elements/Node';

import { DOMManager, IDOMManagerOptions } from './managers/DOMManager';
import { CanvasManager, ICanvasManagerOptions } from './managers/CanvasManager';
import { ToolManager, IToolManagerOptions } from './managers/ToolManager';
import { SelectionManager, ISelectionManagerOptions } from './managers/SelectionManager';
import { ZoomManager, IZoomManagerOptions } from './managers/ZoomManager';

type GraphEditorOptions = IDOMManagerOptions &
	ICanvasManagerOptions &
	IToolManagerOptions &
	ISelectionManagerOptions &
	IZoomManagerOptions;

export class GraphEditor {
	private _domManager: DOMManager;
	private _canvasManager: CanvasManager;
	private _toolManager: ToolManager;
	private _selectionManager: SelectionManager;
	private _zoomManager: ZoomManager;

	public constructor(id: string, options?: GraphEditorOptions) {
		this._domManager = new DOMManager(this, {
			id: id,
			width: options?.width || 600,
			height: options?.height || 400,
			panelWidth: options?.panelWidth || 250,
		});

		this._canvasManager = new CanvasManager(this, {});

		this._toolManager = new ToolManager(this, {});

		this._selectionManager = new SelectionManager(this, {});

		this._zoomManager = new ZoomManager(this, {
			zoom: options?.zoom || 1,
		});

		this.canvasManager.startCanvas();
	}

	public get domManager(): DOMManager {
		return this._domManager;
	}

	public get canvasManager(): CanvasManager {
		return this._canvasManager;
	}

	public get toolManager(): ToolManager {
		return this._toolManager;
	}

	public get selectionManager(): SelectionManager {
		return this._selectionManager;
	}

	public get zoomManager(): ZoomManager {
		return this._zoomManager;
	}
}
