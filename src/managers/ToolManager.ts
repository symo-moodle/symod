import { GraphEditor } from "../GraphEditor";
import { Tool } from "../tools/Tool";
import { Selector } from "../tools/Selector";

export interface IToolManagerOptions {

}

export class ToolManager {
    private graphEditor: GraphEditor;

    private activeTool: Tool;

    public constructor(graphEditor: GraphEditor, options?: IToolManagerOptions) {
        this.graphEditor = graphEditor;

        this.activeTool = new Selector(this.graphEditor);
    }

    public onLeftDown(x: number, y: number) {
        this.activeTool.onLeftDown(x, y);
    }

    public onLeftUp(x: number, y: number) {
        this.activeTool.onLeftUp(x, y);
    }

    public onRightDown(x: number, y: number) {
        this.activeTool.onRightDown(x, y);
    }

    public onRightUp(x: number, y: number) {
        this.activeTool.onRightUp(x, y);
    }

    public onMouseMove(x: number, y: number) {
        this.activeTool.onMouseMove(x, y);
    }

    public onMouseEnter(x: number, y: number) {
        this.activeTool.onMouseEnter(x, y);
    }

    public onMouseLeave(x: number, y: number) {
        this.activeTool.onMouseLeave(x, y);
    }

    public onDoubleClick(x: number, y: number) {
        this.activeTool.onDoubleClick(x, y);
    }
}