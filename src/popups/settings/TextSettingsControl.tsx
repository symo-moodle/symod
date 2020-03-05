// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type TextSettings = {
	type: 'text';
	id: string;
	label: string;
	text: string;
	disabled?: boolean;
};

export class TextSettingsControl implements ISettingsControl {
	private readonly mSettings: TextSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: TextSettings) {
		this.mSettings = settings;
		const { id, label, text: value, disabled = false } = this.mSettings;
		this.mDom = (<label>{label}
			{this.mInput = (<input type="text" name={id} value={value} disabled={disabled} />) as HTMLInputElement}
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.text = this.mInput.value;
	}
}
