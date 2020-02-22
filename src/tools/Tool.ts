import { GraphEditor } from '../GraphEditor';

export abstract class Tool {
	protected readonly graphEditor: GraphEditor;

	public constructor(graphEditor: GraphEditor) {
		this.graphEditor = graphEditor;
	}

	/* eslint-disable @typescript-eslint/no-empty-function */
	public onLeftDown(_x: number, _y: number): void {}
	public onLeftUp(_x: number, _y: number): void {}
	public onRightDown(_x: number, _y: number): void {}
	public onRightUp(_x: number, _y: number): void {}
	public onMouseMove(_x: number, _y: number): void {}
	public onMouseEnter(_x: number, _y: number): void {}
	public onMouseLeave(_x: number, _y: number): void {}
	public onDoubleClick(_x: number, _y: number): void {}
	public onRightClick(_x: number, _y: number): void {}
	/* eslint-enable @typescript-eslint/no-empty-function */
}
