import { GraphEditor } from '../GraphEditor';
import { Tool } from '../tools/Tool';
import { Selector } from '../tools/Selector';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IToolManagerOptions {}

export class ToolManager {
	private graphEditor: GraphEditor;

	private activeTool: Tool;

	public constructor(graphEditor: GraphEditor, _options?: IToolManagerOptions) {
		this.graphEditor = graphEditor;

		this.activeTool = new Selector(this.graphEditor);
	}

	public onLeftDown(x: number, y: number): void {
		this.activeTool.onLeftDown(x, y);
	}

	public onLeftUp(x: number, y: number): void {
		this.activeTool.onLeftUp(x, y);
	}

	public onRightDown(x: number, y: number): void {
		this.activeTool.onRightDown(x, y);
	}

	public onRightUp(x: number, y: number): void {
		this.activeTool.onRightUp(x, y);
	}

	public onMouseMove(x: number, y: number): void {
		this.activeTool.onMouseMove(x, y);
	}

	public onMouseEnter(x: number, y: number): void {
		this.activeTool.onMouseEnter(x, y);
	}

	public onMouseLeave(x: number, y: number): void {
		this.activeTool.onMouseLeave(x, y);
	}

	public onDoubleClick(x: number, y: number): void {
		this.activeTool.onDoubleClick(x, y);
	}
}
