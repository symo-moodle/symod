import { GraphEditor } from '../GraphEditor';
import { MouseButtons } from '../utils/MouseButtons';
import { SettingsPopup } from './SettingsPopup';
import { TextEditor } from './TextEditor';

function graphEditorDOM(id: string): string {
	return `
        <div id="${id}" class="grapheditor">
            <table>
                <tr>
                    <td id="${id}_panel" class="panel"></td>
                    <td id="${id}_canvasbox" class="canvasbox">
						<div>
							<div id="${id}_overlay" class="overlay">
								<textarea id="${id}_textarea"></textarea>
								<div id="${id}_settings" class="settings"></div>
							</div>
							<canvas id="${id}_canvas"></canvas>
						</div>
                    </td>
                </tr>
            </table>
        </div>
    `;
}

export interface IDOMManagerOptions {
	id: string;
	width: number;
	height: number;
	panelWidth: number;
}

export class DOMManager {
	private readonly mId: string;
	private mWidth: number;
	private mHeight: number;
	private readonly mPanelWidth: number;

	private readonly mGraphEditor: GraphEditor;

	private mRootElement!: HTMLElement;
	private mPanelElement!: HTMLElement;
	private mCanvasBoxElement!: HTMLElement;
	private mCanvasElement!: HTMLCanvasElement;
	private mCanvasOverlayElement!: HTMLElement;

	private mTextEditor!: TextEditor;
	private mSettingsPopup!: SettingsPopup;

	public constructor(graphEditor: GraphEditor, options: IDOMManagerOptions) {
		this.mGraphEditor = graphEditor;

		this.mId = options.id;
		this.mWidth = options.width;
		this.mHeight = options.height;
		this.mPanelWidth = options.panelWidth;

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

	public resize(width: number, height: number): void {
		this.mWidth = width;
		this.mHeight = height;

		this.mRootElement.style.width = `${this.mWidth}px`;
		this.mRootElement.style.height = `${this.mHeight}px`;

		this.mPanelElement.style.width = `${this.mPanelWidth}px`;
		this.mPanelElement.style.minWidth = `${this.mPanelWidth}px`;

		this.mCanvasElement.width = this.mCanvasBoxElement.offsetWidth * this.mGraphEditor.zoomManager.zoom;
		this.mCanvasElement.height = this.mCanvasBoxElement.offsetHeight * this.mGraphEditor.zoomManager.zoom;
		this.mGraphEditor.canvasManager.resize(this.mCanvasElement.width, this.mCanvasElement.height);
	}

	public setCanvasCursor(cursor: string): void {
		this.mCanvasElement.style.cursor = cursor;
	}

	public get canvasContext(): CanvasRenderingContext2D {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.mCanvasElement.getContext('2d')!;
	}

	public get textEditor(): TextEditor {
		return this.mTextEditor;
	}

	public get settingsPopup(): SettingsPopup {
		return this.mSettingsPopup;
	}

	public showOverlay(): void {
		this.mCanvasOverlayElement.style.visibility = 'visible';
	}

	public hideOverlay(): void {
		this.mCanvasOverlayElement.style.visibility = 'hidden';
	}

	private createDOM(): void {
		/* eslint-disable @typescript-eslint/no-non-null-assertion */
		const doc = new DOMParser().parseFromString(graphEditorDOM(this.mId), 'text/html');
		this.mRootElement = doc.getElementById(this.mId)!;
		this.mPanelElement = doc.getElementById(`${this.mId}_panel`)!;
		this.mCanvasBoxElement = doc.getElementById(`${this.mId}_canvasbox`)!;
		this.mCanvasElement = doc.getElementById(`${this.mId}_canvas`)! as HTMLCanvasElement;
		this.mCanvasOverlayElement = doc.getElementById(`${this.mId}_overlay`)!;
		const textEditorElement = doc.getElementById(`${this.mId}_textarea`)! as HTMLTextAreaElement;
		const settingsPopupElement = doc.getElementById(`${this.mId}_settings`)!;
		/* eslint-enable @typescript-eslint/no-non-null-assertion */

		this.mTextEditor = new TextEditor(this.mGraphEditor, textEditorElement);
		this.mSettingsPopup = new SettingsPopup(this.mGraphEditor, settingsPopupElement);

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
		this.mPanelElement.innerText = `mousedown: ${x}x${y}`;
		if(e.button === MouseButtons.LEFT) {
			this.mGraphEditor.toolManager.onLeftDown(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
		else if(e.button === MouseButtons.RIGHT) {
			this.mGraphEditor.toolManager.onRightDown(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onMouseUp(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.mPanelElement.innerText = `mouseup ${x}x${y}`;
		if(e.button === MouseButtons.LEFT) {
			this.mGraphEditor.toolManager.onLeftUp(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
		else if(e.button === MouseButtons.RIGHT) {
			this.mGraphEditor.toolManager.onRightUp(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onMouseMove(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.mPanelElement.innerText = `mousemove ${x}x${y}`;
		this.mGraphEditor.toolManager.onMouseMove(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onMouseEnter(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.mPanelElement.innerText = `mouseenter ${x}x${y}`;
		this.mGraphEditor.toolManager.onMouseEnter(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onMouseLeave(e: MouseEvent): void {
		const { x, y } = this.calculateCanvasCoordinates(e);
		this.mPanelElement.innerText = `mouseleave ${x}x${y}`;
		this.mGraphEditor.toolManager.onMouseLeave(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
	}

	private onDoubleClick(e: MouseEvent): void {
		e.preventDefault();
		const { x, y } = this.calculateCanvasCoordinates(e);
		if(e.button === MouseButtons.LEFT) {
			this.mPanelElement.innerText = `dblclick ${x}x${y}`;
			this.mGraphEditor.toolManager.onDoubleClick(x, y, { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey });
		}
	}

	private onRightClick(e: MouseEvent): void {
		e.preventDefault();
	}

	private calculateCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
		const rect = this.mCanvasElement.getBoundingClientRect();
		const mouseX = (e.x - rect.left) / this.mGraphEditor.zoomManager.zoom;
		const mouseY = (e.y - rect.top) / this.mGraphEditor.zoomManager.zoom;
		return { x: mouseX, y: mouseY };
	}
}
