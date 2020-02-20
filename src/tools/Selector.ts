import { Cursor } from "../utils/Cursor";
import { Tool } from "./Tool";
import { GraphEditor } from "../GraphEditor";
import { Element } from "../elements/Element";

export interface ISelectorAction {
    readonly cursor: Cursor;
}

function isISelectorAction(o: any): o is ISelectorAction {
    const obj = o as ISelectorAction;
    return  obj.cursor !== undefined;
}

export interface ISelectable extends ISelectorAction {
    readonly isSelected: boolean;
    readonly isFocused: boolean;
}

function isISelectable(o: any): o is ISelectable {
    const obj = o as ISelectable;
    return  isISelectorAction(obj) &&
            obj.isSelected !== undefined &&
            obj.isFocused !== undefined;
}

export interface IMovable extends ISelectorAction {
    startMove(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    finishMove(x: number, y: number): void;
    cancelMove(): void;
}

function isIMovable(o: any): o is IMovable {
    const obj = o as IMovable;
    return  isISelectorAction(obj) &&
            obj.startMove !== undefined &&
            obj.moveTo !== undefined &&
            obj.finishMove !== undefined &&
            obj.cancelMove !== undefined;
}

export class Selector extends Tool {
    private possiblyClickedOrMoved: Element | null;
    private possiblyClickedOrMovedAt: {x: number, y: number} | null;
    private moving: IMovable | null;

    public constructor(graphEditor: GraphEditor) {
        super(graphEditor);
        this.possiblyClickedOrMoved = null;
        this.possiblyClickedOrMovedAt = null;
        this.moving = null;
    }

    public onLeftDown(x: number, y: number): void {
        const el = this.graphEditor.canvasManager.rootStage.getElementUnderPosition(x, y);
        if(el != null) {
            this.possiblyClickedOrMoved = el;
            this.possiblyClickedOrMovedAt = {x, y};
        }
        else {
            this.graphEditor.selectionManager.unselectAll();
        }
    }

    public onLeftUp(x: number, y: number): void {
        if(this.possiblyClickedOrMoved != null) {
            if(isISelectable(this.possiblyClickedOrMoved)) {
                this.graphEditor.selectionManager.unselectAll();
                this.graphEditor.selectionManager.select(this.possiblyClickedOrMoved);
            }
            this.possiblyClickedOrMoved = null;
            this.possiblyClickedOrMovedAt = null;
        }
        else {
            this.moving?.finishMove(x, y);
            this.moving = null;
        }
    }

    public onMouseMove(x: number, y: number): void {
        const el = this.graphEditor.canvasManager.rootStage.getElementUnderPosition(x, y);
        if(el != null && isISelectorAction(el)) {
            this.graphEditor.domManager.setCanvasCursor(el.cursor);
        }
        else {
            this.graphEditor.domManager.setCanvasCursor(Cursor.DEFAULT);
        }

        if(this.possiblyClickedOrMoved != null) {
            if(isIMovable(this.possiblyClickedOrMoved)) {
                this.moving = this.possiblyClickedOrMoved;
                this.moving.startMove(this.possiblyClickedOrMovedAt!.x, this.possiblyClickedOrMovedAt!.y);
                this.moving.moveTo(x, y);
            }
            this.possiblyClickedOrMoved = null;
            this.possiblyClickedOrMovedAt = null;
        }
        else {
            this.moving?.moveTo(x, y);
        }
    }

    public onMouseLeave(x: number, y: number): void {
        this.moving?.cancelMove();
        this.moving = null;
    }
}