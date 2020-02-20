import { Stage } from "./Stage";

export abstract class Element {
    public static readonly SELECTED_FILLSTYLE: string = '#0000FF';
    public static readonly SELECTED_STROKESTYLE: string = '#0000FF';

    private _parent: Stage | null;

    public constructor(parent: Stage | null) {
        this._parent = parent;
    }

    public get parent(): Stage | null {
        return this._parent;
    }

    public invalidate() {
        this.parent?.invalidate();
    }

    public abstract draw(c: CanvasRenderingContext2D): void;

    public abstract get boundingBox(): {x: number, y: number, width: number, height: number};

    public abstract getElementUnderPosition(x: number, y: number): Element | null;
}