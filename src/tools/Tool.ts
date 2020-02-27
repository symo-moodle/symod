import { GraphEditor } from '../GraphEditor';

export type Keys = {
	ctrl: boolean;
	alt: boolean;
	shift: boolean;
};

export abstract class Tool {
	protected readonly graphEditor: GraphEditor;

	public constructor(graphEditor: GraphEditor) {
		this.graphEditor = graphEditor;
	}

	/* eslint-disable @typescript-eslint/no-empty-function */
	public onLeftDown(_x: number, _y: number, _keys: Keys): void {}
	public onLeftUp(_x: number, _y: number, _keys: Keys): void {}
	public onRightDown(_x: number, _y: number, _keys: Keys): void {}
	public onRightUp(_x: number, _y: number, _keys: Keys): void {}
	public onMouseMove(_x: number, _y: number, _keys: Keys): void {}
	public onMouseEnter(_x: number, _y: number, _keys: Keys): void {}
	public onMouseLeave(_x: number, _y: number, _keys: Keys): void {}
	public onDoubleClick(_x: number, _y: number, _keys: Keys): void {}
	public onRightClick(_x: number, _y: number, _keys: Keys): void {}
	/* eslint-enable @typescript-eslint/no-empty-function */
}
