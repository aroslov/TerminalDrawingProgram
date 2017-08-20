import {max, min} from "../utils";
import {Point} from "./point";

export class Rectangle {
    private _x1: number;
    private _y1: number;
    private _x2: number;
    private _y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number, private border: number = 0) {
        this._x1 = min(x1, x2);
        this._x2 = max(x1, x2);
        this._y1 = min(y1, y2);
        this._y2 = max(y1, y2);
    }

    public get x1(): number {
        return this._x1;
    }

    public get y1(): number {
        return this._y1;
    }

    public get x2(): number {
        return this._x2;
    }

    public get y2(): number {
        return this._y2;
    }

    public truncate(r: Rectangle): Rectangle {
        if (this.x1 > r.x2) return null;
        if (this.y1 > r.y2) return null;
        if (this.x2 < r.x1) return null;
        if (this.y2 < r.y1) return null;
        let x1 = max(this.x1, r.x1);
        let y1 = max(this.y1, r.y1);
        let x2 = min(this.x2, r.x2);
        let y2 = min(this.y2, r.y2);
        return new Rectangle(x1, y1, x2, y2);
    }

    public isOnTheBorder(point: Point): boolean {
        if ((point.x == this.x1-this.border) || (point.x == this.x2+this.border)) {
            return (point.y >= this.y1-this.border) && (point.y <= this.y2+this.border);
        }
        if ((point.y == this.y1-this.border) || (point.y == this.y2+this.border)) {
            return (point.x >= this.x1-this.border) && (point.x <= this.x2+this.border);
        }
        return false;
    }
}