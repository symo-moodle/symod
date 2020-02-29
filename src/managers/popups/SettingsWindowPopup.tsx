/* eslint-disable max-classes-per-file */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { BaseWindowPopup } from './BaseWindowPopup';
import { GraphEditor } from '../../GraphEditor';

type TextSettings = {
	type: 'text';
	id: string;
	label: string;
	text: string;
	disabled?: boolean;
};

type NumberSettings = {
	type: 'number';
	id: string;
	label: string;
	number: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
};

type ColorSettings = {
	type: 'color';
	id: string;
	label: string;
	color: string;
	disabled?: boolean;
};

type RangeSettings = {
	type: 'range';
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	disabled?: boolean;
};

type CheckboxSettings = {
	type: 'checkbox';
	id: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
};

type RadioSettings = {
	type: 'radio';
	id: string;
	radios: {
		label: string;
		value: string;
		checked?: boolean;
	}[];
	disabled?: boolean;
};

type SelectSettings = {
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

type SettingsElements = TextSettings
					  | NumberSettings
					  | ColorSettings
					  | RangeSettings
					  | CheckboxSettings
					  | RadioSettings
					  | SelectSettings;

interface ISettingsControlCreator {
	new(settings: SettingsElements): ISettingsControl;
}

interface ISettingsControl {
	getDom(): HTMLElement;
	updateSetting(): void;
}

class TextSettingsControl implements ISettingsControl {
	private readonly mSettings: TextSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: TextSettings) {
		this.mSettings = settings;
		const { id, label, text: value, disabled = false } = this.mSettings;
		this.mDom = (
			<label>{label}
				{this.mInput = (<input type="text" name={id} value={value} disabled={disabled}/>) as HTMLInputElement}
			</label>
		);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.text = this.mInput.value;
	}
}

class NumberSettingsControl implements ISettingsControl {
	private readonly mSettings: NumberSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: NumberSettings) {
		this.mSettings = settings;
		const { id, label, min = NaN, max = NaN, step = NaN, number: value, disabled = false } = this.mSettings;
		this.mDom = (
			<label>{label}
				{this.mInput = (
					<input type="number" name={id} min={min} max={max} step={step} value={value} disabled={disabled}/>
				) as HTMLInputElement}
			</label>
		);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.number = parseFloat(this.mInput.value);
	}
}

class ColorSettingsControl implements ISettingsControl {
	private readonly mSettings: ColorSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: ColorSettings) {
		this.mSettings = settings;
		const { id, label, color: value, disabled = false } = this.mSettings;
		this.mDom = (
			<label>{label}
				{this.mInput = (<input type="color" name={id} value={value} disabled={disabled}/>) as HTMLInputElement}
			</label>
		);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.color = this.mInput.value;
	}
}

class RangeSettingsControl implements ISettingsControl {
	private readonly mSettings: RangeSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: RangeSettings) {
		this.mSettings = settings;
		const { id, label, min = NaN, max = NaN, step = NaN, value, disabled = false } = this.mSettings;
		this.mDom = (
			<label>{label}
				{this.mInput = (
					<input type="range" name={id} min={min} max={max} step={step} value={value} disabled={disabled}/>
				) as HTMLInputElement}
			</label>
		);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.value = parseFloat(this.mInput.value);
	}
}

class CheckboxSettingsControl implements ISettingsControl {
	private readonly mSettings: CheckboxSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement;

	public constructor(settings: CheckboxSettings) {
		this.mSettings = settings;
		const { id, label, checked, disabled = false } = this.mSettings;
		this.mDom = (
			<label>{label}
				{this.mInput = (
					<input type="checkbox" name={id} checked={checked} disabled={disabled}/>
				) as HTMLInputElement}
			</label>
		);
	}

	public getDom(): HTMLElement {
		return this.mDom;
	}

	public updateSetting(): void {
		this.mSettings.checked = this.mInput.checked;
	}
}

class RadioSettingsControl implements ISettingsControl {
	private readonly mSettings: RadioSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLInputElement[];

	public constructor(settings: RadioSettings) {
		this.mSettings = settings;
		const { id, radios, disabled = false } = this.mSettings;
		this.mInput = [];
		this.mDom = (
			<div>
				{radios.map((radio, i) => {
					this.mInput[i] = (
						<input type="radio" name={id} value={radio.value} checked={radio.checked} disabled={disabled}/>
					) as HTMLInputElement;
					return (
						<label>{radio.label}
							{this.mInput[i]}
						</label>
					);
				})}
			</div>
		);
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

class SelectSettingsControl implements ISettingsControl {
	private readonly mSettings: SelectSettings;
	private readonly mDom: HTMLElement;
	private readonly mInput: HTMLOptionElement[];

	public constructor(settings: SelectSettings) {
		this.mSettings = settings;
		const { id, label, options, disabled = false } = this.mSettings;
		this.mInput = [];
		this.mDom = (
			<label>{label}
				<select name={id} disabled={disabled}>
					{options.map((option, i) => {
						this.mInput[i] = (
							<option value={option.value} selected={option.selected}>{option.label}</option>
						) as HTMLOptionElement;
						return this.mInput[i];
					})}
				</select>
			</label>
		);
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

export type SettingsGroups = {
	name: string;
	elements: SettingsElements[];
};

export interface IShowSettingsPopupOptions {
	groups: SettingsGroups[];
}

export class SettingsWindowPopup extends BaseWindowPopup {
	private readonly mGraphEditor: GraphEditor;

	private mOnSettingsChanged: ((groups: SettingsGroups[]) => void) | null;
	private mTitle: string;
	private mGroups: SettingsGroups[];
	private mSettings: ISettingsControl[];

	public constructor(graphEditor: GraphEditor, overlayElement: HTMLElement) {
		super(overlayElement);
		this.mGraphEditor = graphEditor;
		this.mOnSettingsChanged = null;
		this.mTitle = '';
		this.mGroups = [];
		this.mSettings = [];
	}

	public showSettingsPopup(
		title: string, onSettingsChanged: (groups: SettingsGroups[]) => void, options: IShowSettingsPopupOptions
	): void {
		this.mTitle = title;
		this.mOnSettingsChanged = onSettingsChanged;
		this.mGroups = options.groups;

		this.showPopup();
	}

	protected configureHeader(): {preTitle?: HTMLElement[]; title: HTMLElement; postTitle?: HTMLElement[]} {
		return {
			title: (<span><b>Settings: </b>{this.mTitle}</span>)
		};
	}

	protected configureMainContent(): HTMLElement[] {
		this.mSettings = [];
		return this.mGroups.map(group => <fieldset class="group content">
			<legend>{group.name}</legend>
			{group.elements.map((element) => {
				let control: ISettingsControl;
				switch(element.type) {
					case 'text': {
						control = new TextSettingsControl(element);
						break;
					}
					case 'number': {
						control = new NumberSettingsControl(element);
						break;
					}
					case 'color': {
						control = new ColorSettingsControl(element);
						break;
					}
					case 'range': {
						control = new RangeSettingsControl(element);
						break;
					}
					case 'checkbox': {
						control = new CheckboxSettingsControl(element);
						break;
					}
					case 'radio': {
						control = new RadioSettingsControl(element);
						break;
					}
					case 'select': {
						control = new SelectSettingsControl(element);
						break;
					}
				}
				this.mSettings.push(control);
				return control.getDom();
			})}

		</fieldset>);
	}

	protected configureFooter(): HTMLElement[] {
		return [
			(<button class="cancel" onClick={this.closePopup.bind(this)}>Cancel</button>),
			(<button class="ok" onClick={this.saveSettings.bind(this)}>OK</button>)
		];
	}

	private saveSettings(): void {
		this.closePopup();

		for(const setting of this.mSettings) {
			setting.updateSetting();
		}

		if(this.mOnSettingsChanged !== null) {
			this.mOnSettingsChanged(this.mGroups);
		}
	}
}
