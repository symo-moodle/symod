import { GraphEditor } from '../GraphEditor';

export abstract class Base {
	private readonly mGraphEditor: GraphEditor;

	protected constructor(graphEditor: GraphEditor) {
		this.mGraphEditor = graphEditor;
	}

	protected get graphEditor(): GraphEditor {
		return this.mGraphEditor;
	}
}
