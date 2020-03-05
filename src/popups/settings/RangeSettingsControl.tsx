// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type RangeSettings = {
	type: 'range';
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	disabled?: boolean;
};

export class RangeSettingsControl implements ISettingsControl {
	private readonly mSettings: RangeSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: RangeSettings) {
		this.mSettings = settings;
		const { id, label, min = NaN, max = NaN, step = NaN, value, disabled = false } = this.mSettings;
		this.mDom = (<label>{label}
			{this.mInput = (
				<input type="range" name={id} min={min} max={max} step={step} value={value} disabled={disabled} />
			) as HTMLInputElement}
		</label>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.value = parseFloat(this.mInput.value);
	}
}
