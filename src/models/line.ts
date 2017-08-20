import {Rectangle} from "./rectangle";

export class Line extends Rectangle {
    public isHorizontal(): boolean {
        return this.y1 == this.y2;
    }

    public isVertical(): boolean {
        return this.x1 == this.x2;
    }
}