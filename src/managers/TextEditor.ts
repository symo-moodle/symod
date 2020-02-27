import { Element } from '../elements/Element';
import { GraphEditor } from '../GraphEditor';
import { KeyCodes } from '../utils/KeyCodes';

export interface IShowTextEditorOptions {
	x: number;
	y: number;
	width: number;
	height: number;
	multiline?: boolean;
	font?: string;
	textAlign?: 'left' | 'center' | 'right';
	fontColor?: string;
}

export class TextEditor {
	private readonly mGraphEditor: GraphEditor;
	private mTextEditorElement: HTMLTextAreaElement;
	private mMultiline: boolean;
	private mOnTextEditingFinished: ((text: string) => void) | null;

	public constructor(graphEditor: GraphEditor, textEditorElement: HTMLTextAreaElement) {
		this.mGraphEditor = graphEditor;
		this.mTextEditorElement = textEditorElement;
		this.mMultiline = false;
		this.mOnTextEditingFinished = null;

		this.mTextEditorElement.onblur = this.onTextareaFocusLose.bind(this);
		this.mTextEditorElement.onkeydown = this.onTextareaKeyDown.bind(this);
		this.mTextEditorElement.style.display = 'none';
	}

	public showTextEditor(
		text: string,
		onTextEditingFinished: (text: string) => void,
		options: IShowTextEditorOptions
	): void {
		const multiline = options.multiline ?? false;
		const font = options.font ?? 'normal normal normal 10px /1.1 courier';
		const fontColor = options.fontColor ?? 'black';
		const textAlign = options.textAlign ?? 'left';
		this.mOnTextEditingFinished = onTextEditingFinished;
		this.mMultiline = multiline;
		const { zoom } = this.mGraphEditor.zoomManager;

		this.mTextEditorElement.value = text;
		this.mTextEditorElement.style.left = `${options.x * zoom}px`;
		this.mTextEditorElement.style.top = `${options.y * zoom}px`;
		this.mTextEditorElement.style.width = `${options.width * zoom}px`;
		this.mTextEditorElement.style.height = `${options.height * zoom}px`;

		this.mTextEditorElement.style.font = font;
		this.mTextEditorElement.style.fontSize = `${parseInt(this.mTextEditorElement.style.fontSize) * zoom}px`;
		this.mTextEditorElement.style.color = fontColor;
		this.mTextEditorElement.style.textAlign = textAlign;
		this.mTextEditorElement.style.outlineColor = Element.SELECTED_STROKESTYLE;

		this.mGraphEditor.domManager.showOverlay();
		this.mTextEditorElement.style.display = 'block';
		this.mTextEditorElement.focus();
	}

	private onTextareaKeyDown(e: KeyboardEvent): void {
		if(e.keyCode === KeyCodes.ESCAPE) {
			this.mTextEditorElement.blur();
		}
		else if(e.keyCode === KeyCodes.ENTER && !this.mMultiline) {
			e.preventDefault();
			this.mTextEditorElement.blur();
		}
	}

	private onTextareaFocusLose(): void {
		this.mGraphEditor.domManager.hideOverlay();
		this.mTextEditorElement.style.display = 'none';
		const text = this.mTextEditorElement.value;
		if(this.mOnTextEditingFinished !== null) {
			this.mOnTextEditingFinished(text);
		}
		this.mOnTextEditingFinished = null;
	}
}
