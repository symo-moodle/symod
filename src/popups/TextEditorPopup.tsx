// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { BaseElement } from '../elements/BaseElement';
import { BasePopup } from './BasePopup';
import { GraphEditor } from '../GraphEditor';
import { KeyCodes } from '../utils/KeyCodes';

export interface ITextEditorPopupOptions {
	x: number;
	y: number;
	width: number;
	height: number;
	multiline?: boolean;
	font?: string;
	textAlign?: 'left' | 'center' | 'right';
	fontColor?: string;
}

export class TextEditorPopup extends BasePopup {
	private readonly mTextEditorElement: HTMLTextAreaElement;
	private readonly mMultiline: boolean;
	private readonly mOnTextEditingFinished: (text: string) => void;

	public constructor(
		graphEditor: GraphEditor,
		text: string,
		onTextEditingFinished: (text: string) => void,
		options: ITextEditorPopupOptions
	) {
		super(graphEditor);
		this.mMultiline = options.multiline ?? false;
		this.mOnTextEditingFinished = onTextEditingFinished;

		const font = options.font ?? 'normal normal normal 10px /1.1 courier';
		const fontColor = options.fontColor ?? 'black';
		const textAlign = options.textAlign ?? 'left';
		const { zoom } = this.graphEditor.zoomManager;

		this.mTextEditorElement = (<textarea></textarea> as HTMLTextAreaElement);
		this.mTextEditorElement.onblur = this.onTextareaFocusLose.bind(this);
		this.mTextEditorElement.onkeydown = this.onTextareaKeyDown.bind(this);

		this.mTextEditorElement.value = text;
		this.mTextEditorElement.style.left = `${options.x * zoom}px`;
		this.mTextEditorElement.style.top = `${options.y * zoom}px`;
		this.mTextEditorElement.style.width = `${options.width * zoom}px`;
		this.mTextEditorElement.style.height = `${options.height * zoom}px`;

		this.mTextEditorElement.style.font = font;
		this.mTextEditorElement.style.fontSize = `${parseInt(this.mTextEditorElement.style.fontSize) * zoom}px`;
		this.mTextEditorElement.style.color = fontColor;
		this.mTextEditorElement.style.textAlign = textAlign;
		this.mTextEditorElement.style.outlineColor = BaseElement.SELECTED_STROKESTYLE;
	}

	public getDOM(): HTMLElement {
		return this.mTextEditorElement;
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
		this.close();
		const text = this.mTextEditorElement.value;
		this.mOnTextEditingFinished(text);
	}
}
