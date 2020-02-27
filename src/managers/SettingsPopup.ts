import { GraphEditor } from '../GraphEditor';

function settingsDOM(): string {
	return `
		<div class="header">
			<span class="title"></span>
			<button class="cancel">×</button>
		</div>
		<div class="main"></div>
		<div class="footer">
			<button class="cancel">Cancel</button>
			<button class="ok">OK</button>
		</div>
	`;
}

function settingsGroupDOM(name: string): string {
	return `
		<fieldset class="group content">
			<legend>${name}</legend>
		</fieldset>
	`;
}

type TextSettings = {
	type: 'text';
	id: string;
	label: string;
	value: string;
	disabled?: boolean;
};

function settingsTextDOM({ id, label, value, disabled = false }: TextSettings): string {
	return `
		<label>${label}<input type="text" name="${id}" value="${value}" ${disabled ? 'disabled' : ''}></label>
	`;
}

type NumberSettings = {
	type: 'number';
	id: string;
	label: string;
	value: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
};

function settingsNumberDOM(
	{ id, label, value, min = NaN, max = NaN, step = 1, disabled = false }: NumberSettings
): string {
	return `
		<label>${label}<input type="number" name="${id}" min="${min}" max="${max}" step="${step}" value="${value}" ${disabled ? 'disabled' : ''}></label>
	`;
}

type ColorSettings = {
	type: 'color';
	id: string;
	label: string;
	value: string;
	disabled?: boolean;
};

function settingsColorDOM({ id, label, value, disabled = false }: ColorSettings): string {
	return `
		<label>${label}<input type="color" name="${id}" value="${value}" ${disabled ? 'disabled' : ''}></label>
	`;
}

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

function settingsRangeDOM({ id, label, value, min, max, step = 1, disabled = false }: RangeSettings): string {
	return `
		<label>${label}<input type="range" name="${id}" min="${min}" max="${max}" step="${step}" value="${value}" ${disabled ? 'disabled' : ''}></label>
	`;
}

type CheckboxSettings = {
	type: 'checkbox';
	id: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
};

function settingsCheckboxDOM({ id, label, checked, disabled = false }: CheckboxSettings): string {
	return `
		<label>${label}<input type="checkbox" name="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}></label>
	`;
}

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

function settingsRadioDOM({ id, radios, disabled = false }: RadioSettings): string {
	return radios.map(radio => `
		<label>${radio.label}<input type="radio" name="${id}" value="${radio.value}" ${(radio.checked ?? false) ? 'checked' : ''} ${disabled ? 'disabled' : ''}></label>
	`).join('\n');
}

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

function settingsSelectDOM({ id, label, options, disabled = false }: SelectSettings): string {
	return `
		<label>${label}
		<select name="${id}" ${disabled ? 'disabled' : ''}>
			${options.map(option => `
				<option value="${option.value}" ${(option.selected ?? false) ? 'selected' : ''}>${option.label}</option>
			`).join('\n')}
		</select>
	`;
}

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

export class SettingsPopup {
	private readonly mGraphEditor: GraphEditor;
	private readonly mSettingsElement: HTMLElement;

	private mOnSettingsChanged: ((groups: SettingsGroups[]) => void) | null;
	private mGroups: SettingsGroups[];

	public constructor(graphEditor: GraphEditor, settingsElement: HTMLElement) {
		this.mGraphEditor = graphEditor;
		this.mSettingsElement = settingsElement;
		this.mOnSettingsChanged = null;
		this.mGroups = [];
		this.mSettingsElement.style.visibility = 'hidden';
	}

	public showSettingsPopup(
		title: string, onSettingsChanged: (groups: SettingsGroups[]) => void, options: IShowSettingsPopupOptions
	): void {
		this.mOnSettingsChanged = onSettingsChanged;

		const doc = new DOMParser().parseFromString(settingsDOM(), 'text/html');

		const xButton = doc.querySelector('.header .cancel') as HTMLButtonElement;
		const cancelButton = doc.querySelector('.footer .cancel') as HTMLButtonElement;
		const okButton = doc.querySelector('.footer .ok') as HTMLButtonElement;
		const titleElement = doc.querySelector('.header .title') as HTMLElement;

		xButton.onclick = this.onCancelClick.bind(this);
		cancelButton.onclick = this.onCancelClick.bind(this);
		okButton.onclick = this.onOkClick.bind(this);
		titleElement.innerHTML = `<b>Settings: </b>${title}`;

		const mainContent = doc.querySelector('.main') as HTMLElement;
		this.mGroups = options.groups;
		for(const group of this.mGroups) {
			const groupDOM = new DOMParser().parseFromString(settingsGroupDOM(group.name), 'text/html');
			const content = groupDOM.querySelector('.content') as HTMLElement;

			for(const element of group.elements) {
				let dom: string;
				switch(element.type) {
					case 'text': {
						dom = settingsTextDOM(element);
						break;
					}
					case 'number': {
						dom = settingsNumberDOM(element);
						break;
					}
					case 'color': {
						dom = settingsColorDOM(element);
						break;
					}
					case 'range': {
						dom = settingsRangeDOM(element);
						break;
					}
					case 'checkbox': {
						dom = settingsCheckboxDOM(element);
						break;
					}
					case 'radio': {
						dom = settingsRadioDOM(element);
						break;
					}
					case 'select': {
						dom = settingsSelectDOM(element);
						break;
					}
				}
				const elementDOM = new DOMParser().parseFromString(dom, 'text/html');
				elementDOM.body.childNodes.forEach(n => content.appendChild(n));
			}
			groupDOM.body.childNodes.forEach(n => mainContent.appendChild(n));
		}

		while(this.mSettingsElement.hasChildNodes()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.mSettingsElement.removeChild(this.mSettingsElement.firstChild!);
		}
		doc.body.childNodes.forEach(n => this.mSettingsElement.appendChild(n));
		this.mGraphEditor.domManager.showOverlay();
		this.mSettingsElement.style.visibility = 'visible';
	}

	private onCancelClick(): void {
		this.mGraphEditor.domManager.hideOverlay();
		this.mSettingsElement.style.visibility = 'hidden';
	}

	private onOkClick(): void {
		this.mGraphEditor.domManager.hideOverlay();
		this.mSettingsElement.style.visibility = 'hidden';

		for(const group of this.mGroups) {
			for(const element of group.elements) {
				switch(element.type) {
					case 'text': {
						element.value = (this.mSettingsElement.querySelector(`input[name=${element.id}]`) as HTMLInputElement).value;
						break;
					}
					case 'number': {
						element.value = parseFloat((this.mSettingsElement.querySelector(`input[name=${element.id}]`) as HTMLInputElement).value);
						break;
					}
					case 'color': {
						element.value = (this.mSettingsElement.querySelector(`input[name=${element.id}]`) as HTMLInputElement).value;
						break;
					}
					case 'range': {
						element.value = parseFloat((this.mSettingsElement.querySelector(`input[name=${element.id}]`) as HTMLInputElement).value);
						break;
					}
					case 'checkbox': {
						element.checked = (this.mSettingsElement.querySelector(`input[name=${element.id}]`) as HTMLInputElement).checked;
						break;
					}
					case 'radio': {
						const radios = this.mSettingsElement.querySelectorAll(`input[name=${element.id}]`) as NodeListOf<HTMLInputElement>;
						for(let i = 0; i < element.radios.length; i++) {
							element.radios[i].checked = radios[i].checked;
						}
						break;
					}
					case 'select': {
						const options = this.mSettingsElement.querySelectorAll(`select[name=${element.id}] option`) as NodeListOf<HTMLOptionElement>;
						for(let i = 0; i < element.options.length; i++) {
							element.options[i].selected = options[i].selected;
						}
						break;
					}
				}
			}
		}
		if(this.mOnSettingsChanged !== null) {
			this.mOnSettingsChanged(this.mGroups);
		}
	}
}
