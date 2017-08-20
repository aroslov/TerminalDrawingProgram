export function min(x: number, y:number) : number {
    return x < y ? x : y;
}

export function max(x: number, y:number) : number {
    return x > y ? x : y;
}

export function abs(x: number) : number {
    return x < 0 ? -x : x;
}

export function assertPositive(value: number, name : string) {
    if (value <= 0)
        throw `{name} must be positive`
}
