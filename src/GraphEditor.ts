export * from './elements/BasicShapes';
export * from './elements/Label';

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
	/* eslint-disable no-magic-numbers */
	private static readonly DEFAULT_WIDTH = 600;
	private static readonly DEFAULT_HEIGHT = 400;
	private static readonly DEFAULT_PANEL_WIDTH = 250;
	/* eslint-enable no-magic-numbers */

	private readonly mDomManager: DOMManager;
	private readonly mCanvasManager: CanvasManager;
	private readonly mToolManager: ToolManager;
	private readonly mSelectionManager: SelectionManager;
	private readonly mZoomManager: ZoomManager;

	public constructor(id: string, options?: GraphEditorOptions) {
		this.mDomManager = new DOMManager(this, {
			id: id,
			width: options?.width ?? GraphEditor.DEFAULT_WIDTH,
			height: options?.height ?? GraphEditor.DEFAULT_HEIGHT,
			panelWidth: options?.panelWidth ?? GraphEditor.DEFAULT_PANEL_WIDTH
		});

		this.mCanvasManager = new CanvasManager(this, {});

		this.mToolManager = new ToolManager(this, {});

		this.mSelectionManager = new SelectionManager(this, {});

		this.mZoomManager = new ZoomManager(this, { zoom: options?.zoom ?? 1 });

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
