// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type SelectSettings = {
	type: 'select';
	id: string;
	label: string;
	options: {
		label: string;
		value: string;
		selected?: boolean;
	}[];
	disabled?: boolean;
};

export class SelectSettingsControl implements ISettingsControl {
	private readonly mSettings: SelectSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLOptionElement[];

	public constructor(settings: SelectSettings) {
		this.mSettings = settings;
		const { id, label, options, disabled = false } = this.mSettings;
		this.mInput = [];
		this.mDom = (<label>{label}
			<select name={id} disabled={disabled}>
				{options.map((option, i) => {
					this.mInput[i] = (
						<option value={option.value} selected={option.selected}>{option.label}</option>
					) as HTMLOptionElement;
					return this.mInput[i];
				})}
			</select>
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.options.forEach((option, i) => {
			option.selected = this.mInput[i].selected;
		});
	}
}
