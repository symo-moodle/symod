// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { CheckboxSettings, CheckboxSettingsControl } from './settings/CheckboxSettingsControl';
import { ColorSettings, ColorSettingsControl } from './settings/ColorSettingsControl';
import { NumberSettings, NumberSettingsControl } from './settings/NumberSettingsControl';
import { RadioSettings, RadioSettingsControl } from './settings/RadioSettingsControl';
import { RangeSettings, RangeSettingsControl } from './settings/RangeSettingsControl';
import { SelectSettings, SelectSettingsControl } from './settings/SelectSettingsControl';
import { TextSettings, TextSettingsControl } from './settings/TextSettingsControl';
import { BaseWindowPopup } from './BaseWindowPopup';
import { GraphEditor } from '../GraphEditor';

type SettingsElements = TextSettings
					  | NumberSettings
					  | ColorSettings
					  | RangeSettings
					  | CheckboxSettings
					  | RadioSettings
					  | SelectSettings;

export type SettingsGroups = {
	name: string;
	elements: SettingsElements[];
};

export interface IShowSettingsPopupOptions {
	groups: SettingsGroups[];
}

export class SettingsWindowPopup extends BaseWindowPopup {
	private readonly mOnSettingsChanged: (groups: SettingsGroups[]) => void;
	private readonly mTitle: string;
	private readonly mGroups: SettingsGroups[];
	private mSettings: ISettingsControl[];

	public constructor(
		graphEditor: GraphEditor,
		title: string,
		onSettingsChanged: (groups: SettingsGroups[]) => void,
		options: IShowSettingsPopupOptions
	) {
		super(graphEditor);
		this.mTitle = title;
		this.mOnSettingsChanged = onSettingsChanged;
		this.mGroups = options.groups;
		this.mSettings = [];

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
			(<button class="cancel" onClick={this.close.bind(this)}>Cancel</button>),
			(<button class="ok" onClick={this.saveSettings.bind(this)}>OK</button>)
		];
	}

	private saveSettings(): void {
		this.close();

		for(const setting of this.mSettings) {
			setting.updateSetting();
		}

		if(this.mOnSettingsChanged !== null) {
			this.mOnSettingsChanged(this.mGroups);
		}
	}
}
