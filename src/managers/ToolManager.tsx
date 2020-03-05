// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as JSXFactory from 'jsx-dom';
import { BaseTool, Keys } from '../tools/Tool';
import { Base } from '../utils/Base';
import { GraphEditor } from '../GraphEditor';

export interface IToolManagerOptions {
	toolGroups: {
		name: string;
		tools: BaseTool[];
	}[];

	defaultTool: BaseTool;
}

export class ToolManager extends Base {
	private mActiveTool!: BaseTool;
	private readonly mGroups: {
		name: string;
		tools: BaseTool[];
	}[];

	private readonly mDefaultTool: BaseTool;
	private readonly mInputSelectors: {
		tool: BaseTool;
		selector: HTMLInputElement;
	}[];

	public constructor(graphEditor: GraphEditor, options: IToolManagerOptions) {
		super(graphEditor);

		this.mGroups = options.toolGroups;
		this.mDefaultTool = options.defaultTool;

		this.mInputSelectors = [];
		this.mGroups.forEach((group) => {
			group.tools.forEach((tool) => {
				this.mInputSelectors.push({
					tool: tool,
					selector: (
						<input type="radio" name="tool" onChange={(): void => this.activateTool(tool)}/>
					) as HTMLInputElement
				});
			});
		});

		this.mActiveTool = options.defaultTool;
		this.activateTool(options.defaultTool);
	}

	public activateTool(tool: BaseTool): void {
		this.mActiveTool.onToolDeactivated();
		this.mActiveTool = tool;
		this.mActiveTool.onToolActivated();

		const selector = this.mInputSelectors.find(s => s.tool === this.mActiveTool)?.selector ?? null;
		if(selector !== null) {
			selector.checked = true;
		}
	}

	public deactivateTool(): void {
		this.activateTool(this.mDefaultTool);
	}

	public getDOM(): HTMLElement {
		return (<div class="toolpanel">
			{this.mGroups.map(group => <fieldset class="toolgroup">
				<legend>{group.name}</legend>
				{group.tools.map(tool => (
					<label class="tool">
						{this.mInputSelectors.find(s => s.tool === tool)?.selector}
						{tool.getToolGUI().icon}
						<span class="label">{tool.getToolGUI().name}</span>
						<div class="selector"></div>
					</label>
				))}
			</fieldset>)}
		</div>);
	}

	public onLeftDown(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onLeftDown(x, y, keys);
	}

	public onLeftUp(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onLeftUp(x, y, keys);
	}

	public onRightDown(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onRightDown(x, y, keys);
	}

	public onRightUp(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onRightUp(x, y, keys);
	}

	public onMouseMove(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseMove(x, y, keys);
	}

	public onMouseEnter(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseEnter(x, y, keys);
	}

	public onMouseLeave(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onMouseLeave(x, y, keys);
	}

	public onDoubleClick(x: number, y: number, keys: Keys): void {
		this.mActiveTool.onDoubleClick(x, y, keys);
	}
}
