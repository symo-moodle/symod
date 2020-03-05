// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom/svg';
import { BaseTool, Keys } from './Tool';
import { Cursor } from '../utils/Cursor';
import { GraphEditor } from '../GraphEditor';

export class Zoom extends BaseTool {
	// eslint-disable-next-line no-useless-constructor
	public constructor(graphEditor: GraphEditor) {
		super(graphEditor);
	}

	public getToolGUI(): { icon: SVGElement; name: string } {
		return {
			icon: (<svg viewBox="0 0 50 50">
				<circle cx="17.125" cy="17" style={{ stroke: 'black', 'stroke-width': 2, fill: 'white' }} r="14.018"/>
				<line x1="26.125" y1="29" x2="38.125" y2="45" style={{ stroke: 'black', 'stroke-width': 2 }}/>
				<path
					d="M9.375,21.500000000000014a8.752133,8.752133,0,0,1,2.5,-11.250000000000014"
					style={{ stroke: 'black', 'stroke-width': 2 }}/>
			</svg>) as unknown as SVGElement,
			name: 'Zoom'
		};
	}

	public onLeftDown(_x: number, _y: number, _keys: Keys): void {
		this.graphEditor.domManager.setCanvasCursor(Cursor.ZOOM_IN);
		this.graphEditor.zoomManager.zoomIn();
	}

	public onRightDown(_x: number, _y: number, _keys: Keys): void {
		this.graphEditor.domManager.setCanvasCursor(Cursor.ZOOM_OUT);
		this.graphEditor.zoomManager.zoomOut();
	}

	public onMouseMove(_x: number, _y: number, _keys: Keys): void {
		this.graphEditor.domManager.setCanvasCursor(Cursor.ZOOM_IN);
	}
}
