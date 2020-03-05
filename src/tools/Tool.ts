import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';

export type Keys = {
	ctrl: boolean;
	alt: boolean;
	shift: boolean;
};

export abstract class BaseTool extends Base {
	// eslint-disable-next-line no-useless-constructor
	public constructor(graphEditor: GraphEditor) {
		super(graphEditor);
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

	public onToolActivated(): void {}
	public onToolDeactivated(): void {}
	/* eslint-enable @typescript-eslint/no-empty-function */

	public deactivate(): void {
		this.graphEditor.toolManager.deactivateTool();
	}

	public abstract getToolGUI(): { icon: SVGElement; name: string };
}
