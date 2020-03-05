// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type NumberSettings = {
	type: 'number';
	id: string;
	label: string;
	number: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
};

export class NumberSettingsControl implements ISettingsControl {
	private readonly mSettings: NumberSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: NumberSettings) {
		this.mSettings = settings;
		const { id, label, min = NaN, max = NaN, step = NaN, number: value, disabled = false } = this.mSettings;
		this.mDom = (<label>{label}
			{this.mInput = (
				<input type="number" name={id} min={min} max={max} step={step} value={value} disabled={disabled} />
			) as HTMLInputElement}
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.number = parseFloat(this.mInput.value);
	}
}
