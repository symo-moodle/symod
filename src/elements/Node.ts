import { Element } from './Element';
import { ControlPoint } from "./ControlPoint";
import { Stage } from './Stage';
import { ISelectable } from '../tools/Selector';
import { Cursor } from "../utils/Cursor";

export class Node extends Element implements ISelectable {

    public constructor(parent: Stage) {
        super(parent);
    }

    public getElementUnderPosition(x: number, y: number): Element | null {
        return null;
    }

    public get boundingBox(): { x: number; y: number; width: number; height: number; } {
        return {x: 30, y: 30, width: 100, height: 50};
    }
    
    public draw(c: CanvasRenderingContext2D): void {
        c.strokeStyle = 'grey';
        c.fillStyle = 'grey';
        c.fillRect(30, 30, 100, 50);
    }


    public get isSelected(): boolean {
        return this.parent?.canvas.selectionManager.isSelected(this) || false;
    }

    public get isFocused(): boolean {
        return this.parent?.canvas.selectionManager.isFocused(this) || false;
    }

    cursor: Cursor;

}