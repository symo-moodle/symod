/* eslint-disable no-undefined */
import { Keys, Tool } from './Tool';
import { Cursor } from '../utils/Cursor';
import { Element } from '../elements/Element';
import { GraphEditor } from '../GraphEditor';

export interface ISelectorAction {
	readonly cursor: Cursor;
}

function isISelectorAction(o: unknown): o is ISelectorAction {
	const obj = o as ISelectorAction;
	return obj.cursor !== undefined;
}

export interface ISelectable extends ISelectorAction {
	readonly isSelected: boolean;
	readonly isFocused: boolean;
}

function isISelectable(o: unknown): o is ISelectable {
	const obj = o as ISelectable;
	return isISelectorAction(obj)
		&& obj.isSelected !== undefined
		&& obj.isFocused !== undefined;
}

export interface IMovable extends ISelectorAction {
	startMove(x: number, y: number): void;
	moveTo(x: number, y: number): void;
	finishMove(x: number, y: number): void;
	cancelMove(): void;
	validateMoveTo(x: number, y: number): { x: number; y: number };
}

function isIMovable(o: unknown): o is IMovable {
	const obj = o as IMovable;
	return (
		isISelectorAction(obj)
		&& obj.startMove !== undefined
		&& obj.moveTo !== undefined
		&& obj.finishMove !== undefined
		&& obj.cancelMove !== undefined
	);
}

export interface IActionable extends ISelectorAction {
	doAction(x: number, y: number): void;
}

function isIActionable(o: unknown): o is IActionable {
	const obj = o as IActionable;
	return (
		isISelectorAction(obj)
		&& obj.doAction !== undefined
	);
}

export class Selector extends Tool {
	private mPossiblyClickedOrMoved: Element | null;
	private mPossiblyClickedOrMovedAt: { x: number; y: number } | null;
	private mMoving: IMovable[];

	public constructor(graphEditor: GraphEditor) {
		super(graphEditor);
		this.mPossiblyClickedOrMoved = null;
		this.mPossiblyClickedOrMovedAt = null;
		this.mMoving = [];
	}

	public onLeftDown(x: number, y: number, _keys: Keys): void {
		const el = this.graphEditor.canvasManager.rootStage.getElementUnderPosition(x, y);
		if(el !== null) {
			this.mPossiblyClickedOrMoved = el;
			this.mPossiblyClickedOrMovedAt = { x, y };
		}
		else {
			this.graphEditor.selectionManager.unselectAll();
		}
	}

	public onLeftUp(x: number, y: number, keys: Keys): void {
		if(this.mPossiblyClickedOrMoved !== null) {
			if(isISelectable(this.mPossiblyClickedOrMoved)) {
				if(!keys.ctrl) this.graphEditor.selectionManager.unselectAll();
				this.graphEditor.selectionManager.select(this.mPossiblyClickedOrMoved);
				this.graphEditor.domManager.setCanvasCursor(this.mPossiblyClickedOrMoved.cursor);
			}
			this.mPossiblyClickedOrMoved = null;
			this.mPossiblyClickedOrMovedAt = null;
		}
		else {
			for(const m of this.mMoving) {
				m.finishMove(x, y);
			}
			this.mMoving = [];
		}
	}

	public onMouseMove(x: number, y: number, _keys: Keys): void {
		const el = this.graphEditor.canvasManager.rootStage.getElementUnderPosition(x, y);
		if(el !== null && isISelectorAction(el)) {
			this.graphEditor.domManager.setCanvasCursor(el.cursor);
		}
		else {
			this.graphEditor.domManager.setCanvasCursor(Cursor.DEFAULT);
		}

		if(this.mPossiblyClickedOrMoved !== null && this.mPossiblyClickedOrMovedAt !== null) {
			if(isIMovable(this.mPossiblyClickedOrMoved) && isISelectable(this.mPossiblyClickedOrMoved)) {
				if(!this.mPossiblyClickedOrMoved.isSelected) this.graphEditor.selectionManager.unselectAll();
				this.graphEditor.selectionManager.select(this.mPossiblyClickedOrMoved);
				this.graphEditor.domManager.setCanvasCursor(this.mPossiblyClickedOrMoved.cursor);

				this.mMoving = [];
				for(const e of this.graphEditor.selectionManager.selected) {
					if(isIMovable(e)) {
						this.mMoving.push(e);
					}
				}
				for(const m of this.mMoving) {
					m.startMove(this.mPossiblyClickedOrMovedAt.x, this.mPossiblyClickedOrMovedAt.y);
					m.moveTo(x, y);
				}
			}
			else if(isIMovable(this.mPossiblyClickedOrMoved)) {
				this.mMoving = [this.mPossiblyClickedOrMoved];
				for(const m of this.mMoving) {
					m.startMove(this.mPossiblyClickedOrMovedAt.x, this.mPossiblyClickedOrMovedAt.y);
					m.moveTo(x, y);
				}
			}
			this.mPossiblyClickedOrMoved = null;
			this.mPossiblyClickedOrMovedAt = null;
		}
		else {
			for(const m of this.mMoving) {
				m.moveTo(x, y);
			}
		}
	}

	public onMouseLeave(_x: number, _y: number, _keys: Keys): void {
		for(const m of this.mMoving) {
			m.cancelMove();
		}
		this.mMoving = [];
	}

	public onDoubleClick(x: number, y: number): void {
		const el = this.graphEditor.canvasManager.rootStage.getElementUnderPosition(x, y);
		if(el !== null && isIActionable(el)) {
			el.doAction(x, y);
		}
	}
}
