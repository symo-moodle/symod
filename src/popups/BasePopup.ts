import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';

export abstract class BasePopup extends Base {
	// eslint-disable-next-line no-useless-constructor
	public constructor(graphEditor: GraphEditor) {
		super(graphEditor);
	}

	public close(): void {
		this.graphEditor.domManager.hidePopup();
	}

	public abstract getDOM(): HTMLElement;
}
