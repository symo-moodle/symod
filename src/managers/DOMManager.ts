import { GraphEditor } from "../GraphEditor";
import { MouseButtons } from "../utils/MouseButtons";

function graphEditorDOM(id: String) {
    return `
        <div id="${id}" class="grapheditor">
            <table>
                <tr>
                    <td id="${id}_panel" class="panel"></td>
                    <td id="${id}_canvasbox" class="canvasbox">
                        <div><canvas id="${id}_canvas"></canvas></div>
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
    private id: string;
    private width: number;
    private height: number;
    private panelWidth: number;

    private graphEditor: GraphEditor;

    private rootElement!: HTMLElement;
    private panelElement!: HTMLElement;
    private canvasBoxElement!: HTMLElement;
    private canvasElement!: HTMLCanvasElement;

    public constructor(graphEditor: GraphEditor, options: IDOMManagerOptions) {
        this.graphEditor = graphEditor;
        
        this.id = options.id;
        this.width = options.width;
        this.height = options.height;
        this.panelWidth = options.panelWidth;

        this.createDOM();
    }

    public getDOM(): HTMLElement {
        return this.rootElement;
    }

    public injectDOM(element: string | HTMLElement) {
        const parent = (typeof element === 'string') ? document.getElementById(element)! : element;
        
        while(parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild!);
        }

        parent.appendChild(this.rootElement);

        this.resize(this.width, this.height);
    }

    public destroyDOM() {
        const parent = this.rootElement.parentElement!;
        while(parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild!);
        }
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.rootElement.style.width = `${this.width}px`;
        this.rootElement.style.height = `${this.height}px`;

        this.panelElement.style.width = `${this.panelWidth}px`;
        this.panelElement.style.minWidth = `${this.panelWidth}px`;

        this.canvasElement.width = this.canvasBoxElement.offsetWidth * this.graphEditor.zoomManager.zoom;
        this.canvasElement.height = this.canvasBoxElement.offsetHeight * this.graphEditor.zoomManager.zoom;
        this.graphEditor.canvasManager.resize(this.canvasElement.width, this.canvasElement.height);
    }

    public setCanvasCursor(cursor: string) {
        this.canvasElement.style.cursor = cursor;
    }

    public get canvasContext(): CanvasRenderingContext2D {
        return this.canvasElement.getContext('2d')!;
    }

    private createDOM() {
        const doc = new DOMParser().parseFromString(graphEditorDOM(this.id), 'text/html')!;
        this.rootElement = doc.getElementById(this.id)!;
        this.panelElement = doc.getElementById(`${this.id}_panel`)!;
        this.canvasBoxElement = doc.getElementById(`${this.id}_canvasbox`)!;
        this.canvasElement = doc.getElementById(`${this.id}_canvas`)! as HTMLCanvasElement;

        this.canvasElement.onmousemove = this.onMouseMove.bind(this);
        this.canvasElement.onmousedown = this.onMouseDown.bind(this);
        this.canvasElement.onmouseup = this.onMouseUp.bind(this);
        this.canvasElement.onmouseover = this.onMouseEnter.bind(this);
        this.canvasElement.onmouseout = this.onMouseLeave.bind(this);
        this.canvasElement.ondblclick = this.onDoubleClick.bind(this);
        this.canvasElement.oncontextmenu = this.onRightClick.bind(this);
    }

    private onMouseDown(e: MouseEvent) {
        const {x, y} = this.calculateCanvasCoordinates(e);
        this.panelElement.innerText = `mousedown: ${x}x${y}`;
        if(e.button == MouseButtons.LEFT) {
            this.graphEditor.toolManager.onLeftDown(x, y);
        }
        else if(e.button == MouseButtons.RIGHT) {
            this.graphEditor.toolManager.onRightDown(x, y);
        }
    }

    private onMouseUp(e: MouseEvent) {
        const {x, y} = this.calculateCanvasCoordinates(e);
        this.panelElement.innerText = `mouseup ${x}x${y}`;
        if(e.button == MouseButtons.LEFT) {
            this.graphEditor.toolManager.onLeftUp(x, y);
        }
        else if(e.button == MouseButtons.RIGHT) {
            this.graphEditor.toolManager.onRightUp(x, y);
        }
    }

    private onMouseMove(e: MouseEvent) {
        const {x, y} = this.calculateCanvasCoordinates(e);
        this.panelElement.innerText = `mousemove ${x}x${y}`;
        this.graphEditor.toolManager.onMouseMove(x, y);
    }

    private onMouseEnter(e: MouseEvent) {
        const {x, y} = this.calculateCanvasCoordinates(e);
        this.panelElement.innerText = `mouseenter ${x}x${y}`;
        this.graphEditor.toolManager.onMouseEnter(x, y);
    }

    private onMouseLeave(e: MouseEvent) {
        const {x, y} = this.calculateCanvasCoordinates(e);
        this.panelElement.innerText = `mouseleave ${x}x${y}`;
        this.graphEditor.toolManager.onMouseLeave(x, y);
    }

    private onDoubleClick(e: MouseEvent) {
        e.preventDefault();
        const {x, y} = this.calculateCanvasCoordinates(e);
        if(e.button === MouseButtons.LEFT) {  
            this.panelElement.innerText = `dblclick ${x}x${y}`;
            this.graphEditor.toolManager.onDoubleClick(x, y);
        }
    }

    private onRightClick(e: MouseEvent) {
        e.preventDefault();
    }

    private calculateCanvasCoordinates(e: MouseEvent): { x: number, y: number } {
        const rect = this.canvasElement.getBoundingClientRect();
        const mouseX = (e.x - rect.left) / this.graphEditor.zoomManager.zoom;
        const mouseY = (e.y - rect.top) / this.graphEditor.zoomManager.zoom;
        return { x: mouseX, y: mouseY };
    }

}