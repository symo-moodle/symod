import { Element } from '../elements/Element';
import { GraphEditor } from '../GraphEditor';
import { ISelectable } from '../tools/Selector';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISelectionManagerOptions {}

export class SelectionManager {
	private readonly mGraphEditor: GraphEditor;
	private mSelected: (Element & ISelectable)[];

	public constructor(graphEditor: GraphEditor, _options?: ISelectionManagerOptions) {
		this.mGraphEditor = graphEditor;

		this.mSelected = [];
	}

	public get selected(): Element[] {
		return this.mSelected;
	}

	public get focused(): Element | null {
		if(this.selected.length !== 1) return null;
		else return this.selected[0];
	}

	public isSelected(el: Element & ISelectable): boolean {
		return this.mSelected.indexOf(el) !== -1;
	}

	public isFocused(el: Element & ISelectable): boolean {
		return this.focused === el;
	}

	public select(el: Element & ISelectable): void {
		if(this.mSelected.indexOf(el) === -1) {
			this.mSelected.push(el);
			this.mGraphEditor.canvasManager.invalidate();
		}
	}

	public unselect(el: Element & ISelectable): void {
		const idx = this.mSelected.indexOf(el);
		if(idx !== -1) {
			this.mSelected.splice(idx, 1);
			this.mGraphEditor.canvasManager.invalidate();
		}
	}

	public unselectAll(): void {
		this.mSelected = [];
		this.mGraphEditor.canvasManager.invalidate();
	}
}
