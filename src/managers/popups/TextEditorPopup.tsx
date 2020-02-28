// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { Element } from '../../elements/Element';
import { GraphEditor } from '../../GraphEditor';
import { KeyCodes } from '../../utils/KeyCodes';

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

export class TextEditorPopup {
	private readonly mGraphEditor: GraphEditor;
	private readonly mOverlayElement: HTMLElement;
	private readonly mTextEditorElement: HTMLTextAreaElement;
	private mMultiline: boolean;
	private mOnTextEditingFinished: ((text: string) => void) | null;

	public constructor(graphEditor: GraphEditor, overlayElement: HTMLElement) {
		this.mGraphEditor = graphEditor;
		this.mOverlayElement = overlayElement;
		this.mMultiline = false;
		this.mOnTextEditingFinished = null;

		this.mTextEditorElement = (<textarea></textarea> as HTMLTextAreaElement);
		this.mTextEditorElement.onblur = this.onTextareaFocusLose.bind(this);
		this.mTextEditorElement.onkeydown = this.onTextareaKeyDown.bind(this);
		this.mTextEditorElement.style.display = 'none';
		this.mOverlayElement.appendChild(this.mTextEditorElement);
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

		this.mOverlayElement.style.visibility = 'visible';
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
		this.mOverlayElement.style.visibility = 'hidden';
		this.mTextEditorElement.style.display = 'none';
		const text = this.mTextEditorElement.value;
		if(this.mOnTextEditingFinished !== null) {
			this.mOnTextEditingFinished(text);
		}
		this.mOnTextEditingFinished = null;
	}
}
