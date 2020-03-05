import { Base } from '../utils/Base';
import { BaseElement } from '../elements/BaseElement';
import { GraphEditor } from '../GraphEditor';
import { ISelectable } from '../tools/Selector';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISelectionManagerOptions {}

export class SelectionManager extends Base {
	private mSelected: (BaseElement & ISelectable)[];

	public constructor(graphEditor: GraphEditor, _options?: ISelectionManagerOptions) {
		super(graphEditor);

		this.mSelected = [];
	}

	public get selected(): BaseElement[] {
		return this.mSelected;
	}

	public get focused(): BaseElement | null {
		if(this.selected.length !== 1) return null;
		else return this.selected[0];
	}

	public isSelected(el: BaseElement & ISelectable): boolean {
		return this.mSelected.indexOf(el) !== -1;
	}

	public isFocused(el: BaseElement & ISelectable): boolean {
		return this.focused === el;
	}

	public select(el: BaseElement & ISelectable): void {
		if(this.mSelected.indexOf(el) === -1) {
			this.mSelected.push(el);
			this.graphEditor.canvasManager.invalidate();
		}
	}

	public unselect(el: BaseElement & ISelectable): void {
		const idx = this.mSelected.indexOf(el);
		if(idx !== -1) {
			this.mSelected.splice(idx, 1);
			this.graphEditor.canvasManager.invalidate();
		}
	}

	public unselectAll(): void {
		this.mSelected = [];
		this.graphEditor.canvasManager.invalidate();
	}
}
