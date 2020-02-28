// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export abstract class BaseWindowPopup {
	private readonly mOverlayElement: HTMLElement;
	private readonly mPopupElement: HTMLElement;

	public constructor(overlayElement: HTMLElement) {
		this.mOverlayElement = overlayElement;

		this.mPopupElement = (<div class="window"></div>);
		this.mPopupElement.style.visibility = 'hidden';
		this.mOverlayElement.appendChild(this.mPopupElement);
	}

	protected showPopup(): void {
		while(this.mPopupElement.hasChildNodes()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.mPopupElement.removeChild(this.mPopupElement.firstChild!);
		}

		const { preTitle = [], title, postTitle = [] } = this.configureHeader();
		this.mPopupElement.appendChild(
			<div class="header">
				{preTitle}
				<span class="title">{title}</span>
				{postTitle}
				<button class="cancel" onClick={this.closePopup.bind(this)}>×</button>
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

		this.mOverlayElement.style.visibility = 'visible';
		this.mPopupElement.style.visibility = 'visible';
	}

	protected closePopup(): void {
		this.mOverlayElement.style.visibility = 'hidden';
		this.mPopupElement.style.visibility = 'hidden';
	}

	protected abstract configureHeader(): { preTitle?: HTMLElement[]; title: HTMLElement; postTitle?: HTMLElement[]};
	protected abstract configureMainContent(): HTMLElement[];
	protected abstract configureFooter(): HTMLElement[];
}
