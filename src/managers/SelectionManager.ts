import { GraphEditor } from "../GraphEditor";
import { ISelectable } from "../tools/Selector";
import { Element } from "../elements/Element";

export interface ISelectionManagerOptions {

}

export class SelectionManager {
    private graphEditor: GraphEditor;
    private _selected: (Element & ISelectable)[];

    public constructor(graphEditor: GraphEditor, options?: ISelectionManagerOptions) {
        this.graphEditor = graphEditor;

        this._selected = [];
    }

    public get selected(): Element[] {
        return this._selected;
    }

    public get focused(): Element | null {
        if(this.selected.length != 1) return null;
        else return this.selected[0];
    }

    public isSelected(el: Element & ISelectable): boolean {
        return this._selected.indexOf(el) != -1;
    }

    public isFocused(el: Element & ISelectable): boolean {
        return this.focused == el;
    }

    public select(el: Element & ISelectable): void {
        if(this._selected.indexOf(el) == -1) {
            this._selected.push(el);
            this.graphEditor.canvasManager.invalidate();
        }
    }

    public unselect(el: Element & ISelectable): void {
        const idx = this._selected.indexOf(el);
        if(idx != -1) {
            this._selected.splice(idx, 1);
            this.graphEditor.canvasManager.invalidate();
        }
    }

    public unselectAll(): void {
        this._selected = [];
        this.graphEditor.canvasManager.invalidate();
    }
}