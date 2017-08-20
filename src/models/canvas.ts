import {Rectangle} from "./rectangle";
import {Point} from "./point";

export class Canvas extends Rectangle {
    children: Array<Rectangle> = [];

    constructor(private _width: number, private _height: number) {
        super(0, 0, _width+1, _height+1); // append the borders
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public addChild(child: Rectangle): void {
        this.children.push(child);
    }

    isOnChildBorder(point: Point): boolean {
        return !!this.children.find(r => r.isOnTheBorder(point));
    }

    isOnAnyBorder(point: Point): boolean {
        return this.isOnTheBorder(point) || this.isOnChildBorder(point);
    }

    public getFillPoints(point: Point, points?: Array<Point>): Array<Point> {
        if (this.isOnTheBorder(point) || this.isOnChildBorder(point)) return [];
        let result: Array<Point>;
        if (!points) {
            result = [point]
        } else {
            if (points.find(p => point.equals(p)))
                return;
            result = points;
            result.push(point);
        }
        result = result.concat(this.getFillPoints(point.north()));
        result = result.concat(this.getFillPoints(point.west()));
        result = result.concat(this.getFillPoints(point.south()));
        result = result.concat(this.getFillPoints(point.east()));
        return result;
    }

    public getFillPoints2(point: Point): Array<Point> {
        if (this.isOnAnyBorder(point)) return [];
        let result: Array<Point> = [point];
        let points: Array<Point> = [point];

        while (points.length > 0) {
            let currentPoint = points.shift();
            let neighboursToFill = currentPoint.neighbours().filter(point => {
                return (!this.isOnAnyBorder(point)) &&
                    (!points.find(prevPoint => point.equals(prevPoint))) &&
                    (!result.find(prevPoint => point.equals(prevPoint)));
            });
            neighboursToFill.forEach(point => {
                result.push(point);
                points.push(point);
            });
        }
        return result;
    }
}