// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type ColorSettings = {
	type: 'color';
	id: string;
	label: string;
	color: string;
	disabled?: boolean;
};

export class ColorSettingsControl implements ISettingsControl {
	private readonly mSettings: ColorSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: ColorSettings) {
		this.mSettings = settings;
		const { id, label, color: value, disabled = false } = this.mSettings;
		this.mDom = (<label>{label}
			{this.mInput = (<input type="color" name={id} value={value} disabled={disabled} />) as HTMLInputElement}
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.color = this.mInput.value;
	}
}
