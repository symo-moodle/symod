import { GraphEditor } from "../GraphEditor";

export abstract class Tool {
    protected readonly graphEditor: GraphEditor;

    public constructor(graphEditor: GraphEditor) {
        this.graphEditor = graphEditor;
    }

    public onLeftDown(x: number, y: number): void {}
    public onLeftUp(x: number, y: number): void {}
    public onRightDown(x: number, y: number): void {}
    public onRightUp(x: number, y: number): void {}
    public onMouseMove(x: number, y: number): void {}
    public onMouseEnter(x: number, y: number): void {}
    public onMouseLeave(x: number, y: number): void {}
    public onDoubleClick(x: number, y: number): void {}
    public onRightClick(x: number, y: number): void {}
}

