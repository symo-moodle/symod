import { Keys, Tool } from '../tools/Tool';
import { GraphEditor } from '../GraphEditor';
import { Selector } from '../tools/Selector';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IToolManagerOptions {}

export class ToolManager {
	private readonly mGraphEditor: GraphEditor;

	private readonly mActiveTool: Tool;

	public constructor(graphEditor: GraphEditor, _options?: IToolManagerOptions) {
		this.mGraphEditor = graphEditor;

		this.mActiveTool = new Selector(this.mGraphEditor);
	}

	public onLeftDown(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onLeftDown(x, y, keys);
	}

	public onLeftUp(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onLeftUp(x, y, keys);
	}

	public onRightDown(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onRightDown(x, y, keys);
	}

	public onRightUp(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onRightUp(x, y, keys);
	}

	public onMouseMove(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseMove(x, y, keys);
	}

	public onMouseEnter(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseEnter(x, y, keys);
	}

	public onMouseLeave(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseLeave(x, y, keys);
	}

	public onDoubleClick(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onDoubleClick(x, y, keys);
	}
}
