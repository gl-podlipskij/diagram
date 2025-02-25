const MAX_BYTE = 255;

export class RGBColor {
    private readonly _r:number;
    private readonly _g:number;
    private readonly _b:number;

    constructor(r:number, g:number, b:number) {
        this._r = r;
        this._g = g;
        this._b = b;
    }


    get r(): number {
        return this._r;
    }

    get g(): number {
        return this._g;
    }

    get b(): number {
        return this._b;
    }

    toString():string {
        return `rgb(${this._r}, ${this._g}, ${this._b})`
    }
}
export const generateRandomColor = ():RGBColor=>{
    const rgbArray = new Array(3).fill(0).map(()=>{
        return Math.floor(Math.random()*MAX_BYTE);
    }) as [number, number, number];

    return new RGBColor(...rgbArray);
}