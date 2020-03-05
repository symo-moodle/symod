// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';

export type RadioSettings = {
	type: 'radio';
	id: string;
	radios: {
		label: string;
		value: string;
		checked?: boolean;
	}[];
	disabled?: boolean;
};

export class RadioSettingsControl implements ISettingsControl {
	private readonly mSettings: RadioSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement[];

	public constructor(settings: RadioSettings) {
		this.mSettings = settings;
		const { id, radios, disabled = false } = this.mSettings;
		this.mInput = [];
		this.mDom = (<div>
			{radios.map((radio, i) => {
				this.mInput[i] = (
					<input type="radio" name={id} value={radio.value} checked={radio.checked} disabled={disabled} />
				) as HTMLInputElement;
				return (<label>{radio.label}
					{this.mInput[i]}
				</label>);
			})}
		</div>);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.radios.forEach((radio, i) => {
			radio.checked = this.mInput[i].checked;
		});
	}
}
