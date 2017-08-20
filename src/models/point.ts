export class Point {
    constructor (private _x: number, private _y: number) {
    }

    public get x() : number {
        return this._x;
    }

    public get y() : number {
        return this._y;
    }

    public north() : Point {
        return new Point(this.x, this.y-1);
    }

    public west() : Point {
        return new Point(this.x+1, this.y);
    }

    public south() : Point {
        return new Point(this.x, this.y+1);
    }

    public east() : Point {
        return new Point(this.x-1, this.y);
    }

    public equals(p: Point) : boolean {
        return (p.x == this.x) && (p.y == this.y);
    }

    public neighbours() : Array<Point> {
        return [this.north(), this.west(), this.south(), this.east()];
    }
}

