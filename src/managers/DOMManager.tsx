// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { Base } from '../utils/Base';
import { BasePopup } from '../popups/BasePopup';
import { GraphEditor } from '../GraphEditor';
import { MouseButtons } from '../utils/MouseButtons';

export interface IDOMManagerOptions {
	id: string;
	width?: number;
	height?: number;
	panelWidth?: number;
}

export class DOMManager extends Base {
	/* eslint-disable no-magic-numbers */
	private static readonly DEFAULT_WIDTH = 600;
	private static readonly DEFAULT_HEIGHT = 400;
	private static readonly DEFAULT_PANEL_WIDTH = 250;
	/* eslint-enable no-magic-numbers */

	private readonly mId: string;
	private mWidth: number;
	private mHeight: number;
	private readonly mPanelWidth: number;

	private mRootElement!: HTMLElement;
	private mPanelElement!: HTMLElement;
	private mCanvasBoxElement!: HTMLElement;
	private mCanvasElement!: HTMLCanvasElement;
	private mCanvasOverlayElement!: HTMLElement;

	public constructor(graphEditor: GraphEditor, options: IDOMManagerOptions) {
		super(graphEditor);

		this.mId = options.id;
		this.mWidth = options.width ?? DOMManager.DEFAULT_WIDTH;
		this.mHeight = options.height ?? DOMManager.DEFAULT_HEIGHT;
		this.mPanelWidth = options.panelWidth ?? DOMManager.DEFAULT_PANEL_WIDTH;

		this.createDOM();
	}

	public getDOM(): HTMLElement {
		return this.mRootElement;
	}

	public injectDOM(element: string | HTMLElement): void {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const parent = typeof element === 'string' ? document.getElementById(element)! : element;

		while(parent.hasChildNodes()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			parent.removeChild(parent.firstChild!);
		}

		parent.appendChild(this.mRootElement);

		this.resize(this.mWidth, this.mHeight);
	}

	public destroyDOM(): void {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const parent = this.mRootElement.parentElement!;
		while(parent.hasChildNodes()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			parent.removeChild(parent.firstChild!);
		}
	}

	public zoomAdjust(): void {
		this.mCanvasElement.width = this.mCanvasBoxElement.offsetWidth * this.graphEditor.zoomManager.zoom;
		this.mCanvasElement.height = this.mCanvasBoxElement.offsetHeight * this.graphEditor.zoomManager.zoom;
	}

	public resize(width: number, height: number): void {
		this.mWidth = width;
		this.mHeight = height;

		this.mRootElement.style.width = `${this.mWidth}px`;
		this.mRootElement.style.height = `${this.mHeight}px`;

		this.mPanelElement.style.width = `${this.mPanelWidth}px`;
		this.mPanelElement.style.minWidth = `${this.mPanelWidth}px`;
		this.mPanelElement.style.height = `${this.mHeight}px`;

		this.mCanvasBoxElement.style.width = `${this.mWidth - this.mPanelWidth}px`;
		this.mCanvasBoxElement.style.height = `${this.mHeight}px`;

		this.zoomAdjust();
		this.graphEditor.canvasManager.resize(this.mCanvasElement.width, this.mCanvasElement.height);
	}

	public setCanvasCursor(cursor: string): void {
		this.mCanvasElement.style.cursor = cursor;
	}

	public get canvasContext(): CanvasRenderingContext2D {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.mCanvasElement.getContext('2d')!;
	}

	public showPopup(popup: BasePopup): void {
		this.hidePopup();
		this.mCanvasOverlayElement.style.visibility = 'visible';

		const dom = popup.getDOM();
		this.mCanvasOverlayElement.appendChild(dom);
		dom.focus();
	}

	public hidePopup(): void {
		this.mCanvasOverlayElement.style.visibility = 'hidden';

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const parent = this.mCanvasOverlayElement;
		while(parent.hasChildNodes()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			parent.removeChild(parent.firstChild!);
		}
	}

	private createDOM(): void {
		this.mRootElement = (
			<div id={this.mId} class="grapheditor">
				{this.mPanelElement = (<div class="panel">
					{this.graphEditor.toolManager.getDOM()}
				</div>)}
				{this.mCanvasBoxElement = (<div class="canvasbox">
					{this.mCanvasOverlayElement = (<div class="overlay"></div>)}
					{this.mCanvasElement = (<canvas></canvas> as HTMLCanvasElement)}
				</div>)}
			</div>
		);

		this.mCanvasElement.onmousemove = this.onMouseMove.bind(this);
		this.mCanvasElement.onmousedown = this.onMouseDown.bind(this);
		this.mCanvasElement.onmouseup = this.onMouseUp.bind(this);
		this.mCanvasElement.onmouseover = this.onMouseEnter.bind(this);
		this.mCanvasElement.onmouseout = this.onMouseLeave.bind(this);
		this.mCanvasElement.ondblclick = this.onDoubleClick.bind(this);
		this.mCanvasElement.oncontextmenu = this.onRightClick.bind(this);

		this.mCanvasOverlayElement.style.visibility = 'hidden';
	}

	private onMouseDown(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		if(e.button === MouseButtons.LEFT) {
			this.graphEditor.toolManager.onLeftDown(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
		else if(e.button === MouseButtons.RIGHT) {
			this.graphEditor.toolManager.onRightDown(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onMouseUp(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		if(e.button === MouseButtons.LEFT) {
			this.graphEditor.toolManager.onLeftUp(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
		else if(e.button === MouseButtons.RIGHT) {
			this.graphEditor.toolManager.onRightUp(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onMouseMove(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.graphEditor.toolManager.onMouseMove(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onMouseEnter(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.graphEditor.toolManager.onMouseEnter(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onMouseLeave(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.graphEditor.toolManager.onMouseLeave(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onDoubleClick(e: MouseEvent): void {
		e.preventDefault();
		const { x, y } = this.calculateCanvasCoordinates(e);
		if(e.button === MouseButtons.LEFT) {
			this.graphEditor.toolManager.onDoubleClick(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onRightClick(e: MouseEvent): void {
		e.preventDefault();
	}

	private calculateCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
		const rect = this.mCanvasElement.getBoundingClientRect();
		const mouseX = (e.x - rect.left) / this.graphEditor.zoomManager.zoom;
		const mouseY = (e.y - rect.top) / this.graphEditor.zoomManager.zoom;
		return { x: mouseX, y: mouseY };
	}
}
