export * from './elements/BasicShapes';
export * from './elements/Label';
export * from './tools/Selector';
export * from './tools/Zoom';

import { CanvasManager, ICanvasManagerOptions } from './managers/CanvasManager';
import { DOMManager, IDOMManagerOptions } from './managers/DOMManager';
import { ISelectionManagerOptions, SelectionManager } from './managers/SelectionManager';
import { IToolManagerOptions, ToolManager } from './managers/ToolManager';
import { IZoomManagerOptions, ZoomManager } from './managers/ZoomManager';

type GraphEditorOptions = IDOMManagerOptions &
	ICanvasManagerOptions &
	IToolManagerOptions &
	ISelectionManagerOptions &
	IZoomManagerOptions;

export class GraphEditor {
	private readonly mDomManager: DOMManager;
	private readonly mCanvasManager: CanvasManager;
	private readonly mToolManager: ToolManager;
	private readonly mSelectionManager: SelectionManager;
	private readonly mZoomManager: ZoomManager;

	public constructor(config: (graphEditod: GraphEditor) => GraphEditorOptions) {
		const options = config(this);

		this.mCanvasManager = new CanvasManager(this, options);
		this.mToolManager = new ToolManager(this, options);
		this.mSelectionManager = new SelectionManager(this, options);
		this.mZoomManager = new ZoomManager(this, options);

		this.mDomManager = new DOMManager(this, options);

		this.canvasManager.startCanvas();
	}

	public get domManager(): DOMManager {
		return this.mDomManager;
	}

	public get canvasManager(): CanvasManager {
		return this.mCanvasManager;
	}

	public get toolManager(): ToolManager {
		return this.mToolManager;
	}

	public get selectionManager(): SelectionManager {
		return this.mSelectionManager;
	}

	public get zoomManager(): ZoomManager {
		return this.mZoomManager;
	}
}
