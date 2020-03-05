// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type CheckboxSettings = {
	type: 'checkbox';
	id: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
};

export class CheckboxSettingsControl implements ISettingsControl {
	private readonly mSettings: CheckboxSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: CheckboxSettings) {
		this.mSettings = settings;
		const { id, label, checked, disabled = false } = this.mSettings;
		this.mDom = (<label>{label}
			{this.mInput = (
				<input type="checkbox" name={id} checked={checked} disabled={disabled} />
			) as HTMLInputElement}
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.checked = this.mInput.checked;
	}
}
