import { Element } from "./Element";
import { ControlPoint, ControlPointCursor, ControlPointHost } from "./ControlPoint";

export interface ControlBoxHost {
    readonly boundingBox: { x: number; y: number; width: number; height: number; };
    validateControlBoxSizing(width: number, height: number): { width: number, height: number };
}

export class ControlBox extends Element implements ControlPointHost {
    private host: ControlBoxHost;

    private topLeft: ControlPoint;
    private top: ControlPoint;
    private topRight: ControlPoint;
    private left: ControlPoint;
    private right: ControlPoint;
    private bottomLeft: ControlPoint;
    private bottom: ControlPoint;
    private bottomRight: ControlPoint;

    public constructor(host: ControlBoxHost & Element, options?: {radius: number}) {
        super(host.parent);
        this.host = host;
        const {x, y, width, height} = this.host.boundingBox;
        const radius = options?.radius || ControlPoint.CONTROLPOINT_RADIUS;

        this.topLeft = new ControlPoint(this, x, y, { radius: radius, cursor: ControlPointCursor.TOP_LEFT });
        this.top = new ControlPoint(this, x + width/2, y, { radius: radius, cursor: ControlPointCursor.TOP });
        this.topRight = new ControlPoint(this, x + width, y, { radius: radius, cursor: ControlPointCursor.TOP_RIGHT });
        this.left = new ControlPoint(this, x, y + height/2, { radius: radius, cursor: ControlPointCursor.LEFT });
        this.right = new ControlPoint(this, x + width, y + height/2, { radius: radius, cursor: ControlPointCursor.RIGHT });
        this.bottomLeft = new ControlPoint(this, x, y + height, { radius: radius, cursor: ControlPointCursor.BOTTOM_LEFT });
        this.bottom = new ControlPoint(this, x + width/2, y + height, { radius: radius, cursor: ControlPointCursor.BOTTOM });
        this.bottomRight = new ControlPoint(this, x + width, y + height, { radius: radius, cursor: ControlPointCursor.BOTTOM_RIGHT });
    }

    private controlPointStartedMove_PropagationLock: boolean = false;
    public controlPointStartedMove(controlPoint: ControlPoint): void {
        if(!this.controlPointStartedMove_PropagationLock) {
            this.controlPointStartedMove_PropagationLock = true;

            this.controlPointMovingAction(controlPoint, ControlPoint.prototype.startMove);

            this.controlPointStartedMove_PropagationLock = false;
        }
    }

    private controlPointMovedTo_PropagationLock: boolean = false;
    public controlPointMovedTo(controlPoint: ControlPoint): void {
        if(!this.controlPointMovedTo_PropagationLock) {
            this.controlPointMovedTo_PropagationLock = true;

            this.controlPointMovingAction(controlPoint, ControlPoint.prototype.moveTo);

            this.controlPointMovedTo_PropagationLock = false;
        }
    }

    private controlPointFinishedMove_PropagationLock: boolean = false;
    public controlPointFinishedMove(controlPoint: ControlPoint): void {
        if(!this.controlPointFinishedMove_PropagationLock) {
            this.controlPointFinishedMove_PropagationLock = true;

            this.controlPointMovingAction(controlPoint, ControlPoint.prototype.finishMove);

            this.controlPointFinishedMove_PropagationLock = false;
        }
    }

    private controlPointCanceledMove_PropagationLock: boolean = false;
    public controlPointCanceledMove(controlPoint: ControlPoint): void {
        if(!this.controlPointCanceledMove_PropagationLock) {
            this.controlPointCanceledMove_PropagationLock = true;

            for(const controlPoint of this.controlPoints) {
                controlPoint.cancelMove();
            }

            this.controlPointCanceledMove_PropagationLock = false;
        }
    }

    private controlPointMovingAction(controlPoint: ControlPoint, movingAction: (x: number, y: number) => void): void {
        let topX = Math.min(this.topLeft.x, this.left.x, this.bottomLeft.x);
        let topY = Math.min(this.topLeft.y, this.top.y, this.topRight.y);
        let bottomX = Math.max(this.topRight.x, this.right.x, this.bottomRight.x);
        let bottomY = Math.max(this.bottomLeft.y, this.bottom.y, this.bottomRight.y);

        if(controlPoint == this.topLeft) { topX = Math.min(this.topLeft.x, bottomX); topY = Math.min(this.topLeft.y, bottomY); }
        else if(controlPoint == this.top) { topY = Math.min(this.top.y, bottomY); }
        else if(controlPoint == this.topRight) { bottomX = Math.max(this.topRight.x, topX); topY = Math.min(this.topRight.y, bottomY); }
        else if(controlPoint == this.left) { topX = Math.min(this.left.x, bottomX); }
        else if(controlPoint == this.right) { bottomX = Math.max(this.right.x, topX); }
        else if(controlPoint == this.bottomLeft) { topX = Math.min(this.bottomLeft.x, bottomX); bottomY = Math.max(this.bottomLeft.y, topY); }
        else if(controlPoint == this.bottom) { bottomY = Math.max(this.bottom.y, topY); }
        else if(controlPoint == this.bottomRight) { bottomX = Math.max(this.bottomRight.x, topX); Math.max(bottomY = this.bottomRight.y, topY); }

        const { width: newWidth, height: newHeight } = this.host.validateControlBoxSizing(bottomX - topX, bottomY - topY);

        if(controlPoint == this.topLeft) { topX = bottomX - newWidth; topY = bottomY - newHeight }
        else if(controlPoint == this.top) { [topX, bottomX] = [ (topX+bottomX-newWidth)/2, (topX+bottomX+newWidth)/2 ]; topY = bottomY - newHeight; }
        else if(controlPoint == this.topRight) { bottomX = topX + newWidth; topY = bottomY - newHeight }
        else if(controlPoint == this.left) { topX = bottomX - newWidth; [topY, bottomY] = [ (topY+bottomY-newHeight)/2, (topY+bottomY+newHeight)/2 ]; }
        else if(controlPoint == this.right) { bottomX = topX + newWidth; [topY, bottomY] = [ (topY+bottomY-newHeight)/2, (topY+bottomY+newHeight)/2 ]; }
        else if(controlPoint == this.bottomLeft) { topX = bottomX - newWidth; bottomY = topY + newHeight }
        else if(controlPoint == this.bottom) { [topX, bottomX] = [ (topX+bottomX-newWidth)/2, (topX+bottomX+newWidth)/2 ]; bottomY = topY + newHeight; }
        else if(controlPoint == this.bottomRight) { bottomX = topX + newWidth; bottomY = topY + newHeight }

        movingAction.call(this.topLeft, topX, topY);
        movingAction.call(this.top, (topX+bottomX)/2, topY);
        movingAction.call(this.topRight, bottomX, topY);
        movingAction.call(this.left, topX, (topY+bottomY)/2);
        movingAction.call(this.right, bottomX, (topY+bottomY)/2);
        movingAction.call(this.bottomLeft, topX, bottomY);
        movingAction.call(this.bottom, (topX+bottomX)/2, bottomY);
        movingAction.call(this.bottomRight, bottomX, bottomY);

        this.invalidate();
    }

    public draw(c: CanvasRenderingContext2D): void {
        const {x, y, width, height} = this.boundingBox;

        c.strokeStyle = Element.SELECTED_STROKESTYLE;
        c.strokeRect(x, y, width, height);
        for(const controlPoint of this.controlPoints) {
            controlPoint.draw(c);
        }
    }

    public get boundingBox(): { x: number; y: number; width: number; height: number; } {
        return { x: this.topLeft.x, y: this.topLeft.y, width: this.bottomRight.x - this.topLeft.x, height: this.bottomRight.y - this.topLeft.y };
    }

    public getElementUnderPosition(x: number, y: number): Element | null {
        for(const controlPoint of this.controlPoints) {
            const el = controlPoint.getElementUnderPosition(x, y);
            if(el != null) {
                return el;
            }
        }
        return null;
    }

    private get controlPoints(): ControlPoint[] {
        return [this.topLeft, this.top, this.topRight, this.left, this.right, this.bottomLeft, this.bottom, this.bottomRight];
    }
    
}