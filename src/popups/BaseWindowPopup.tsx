// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { BasePopup } from './BasePopup';
import { GraphEditor } from '../GraphEditor';

export abstract class BaseWindowPopup extends BasePopup {
	private readonly mPopupElement: HTMLElement;

	public constructor(graphEditor: GraphEditor) {
		super(graphEditor);

		this.mPopupElement = (<div class="window"></div>);
	}

	public showPopup(): void {
		const { preTitle = [], title, postTitle = [] } = this.configureHeader();
		this.mPopupElement.appendChild(
			<div class="header">
				{preTitle}
				<span class="title">{title}</span>
				{postTitle}
				<button class="cancel" onClick={this.close.bind(this)}>×</button>
			</div>
		);

		const mainContent = this.configureMainContent();
		this.mPopupElement.appendChild(
			<div class="main">
				{mainContent}
			</div>
		);

		const footer = this.configureFooter();
		this.mPopupElement.appendChild(
			<div class="footer">
				{footer}
			</div>
		);
	}

	public getDOM(): HTMLElement {
		return this.mPopupElement;
	}

	protected abstract configureHeader(): { preTitle?: HTMLElement[]; title: HTMLElement; postTitle?: HTMLElement[]};
	protected abstract configureMainContent(): HTMLElement[];
	protected abstract configureFooter(): HTMLElement[];
}
