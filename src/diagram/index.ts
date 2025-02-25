import Fragment, {generateFragments, getShapeCenter} from "./fragment.ts";
import {generateRandomColor, RGBColor} from "./rgb.ts";
import Vector2 from "./vector.ts";

export type DiagramOptions = {
    squareSize ?: number;
    maxResizeSize ?: number;
}
export type FragmentDrawOption = {
    fragment : Fragment;
    color : RGBColor;
}

const DELTA = 0.02;

class DiagramRenderer {

    private readonly _size:number;

    private _scale:number = 2;

    private _maxScale:number = 2;


    private _delta = DELTA;

    private _canvas:HTMLCanvasElement;

    private _ctx:CanvasRenderingContext2D;

    private _fragments:FragmentDrawOption[];


    constructor(canvas:HTMLCanvasElement, options?: DiagramOptions) {
        this._size = options?.maxResizeSize ?? 350;

        this._canvas = canvas;
        this._canvas.style.backgroundColor = 'white';


        this._canvas.width = this._size * this._maxScale;
        this._canvas.height = this._size * this._maxScale;

        const ctx = this._canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Can't get the canvas of the canvas");
        }
        this._ctx = ctx;

        this._fragments = generateFragments(30).map(fragment=>{
            return {
                fragment,
                color : generateRandomColor(),
            }
        })

    }

    get maxSize() {
        return this._size * this._maxScale;
    }

    get currentSize() {
        return this._size * this._scale;
    }


    //render shape by vertexes
    private _renderVertexes(vertexes:Vector2[], color:RGBColor) {
        this._ctx.fillStyle = color.toString();
        this._ctx.beginPath();
        let index = 0;
        const offset = this.maxSize / 2 - this.currentSize / 2;
        while (index <= vertexes.length) {
            const vertex = vertexes[index % (vertexes.length)];

            if (index === 0) {
                this._ctx.moveTo(vertex.x + offset, vertex.y + offset);
            } else {
                this._ctx.lineTo(vertex.x + offset, vertex.y + offset);
            }
            index++;
        }

        this._ctx.fill();
        this._ctx.closePath();
    }

    private _renderFragment(drawOption:FragmentDrawOption) {
        const fragment = drawOption.fragment;
        const vertexes = fragment.vertexes.map(vertex=>{
            return vertex.mul(new Vector2(this._size * this._scale, this._size * this._scale));
        });

        const center = getShapeCenter(vertexes);
        const scaledVertexes = vertexes.map(vertex=>{
            const radius = vertex.sub(center);
            const scaledRadius = radius.scl(1 / this._scale);
            return center.pls(scaledRadius);
        });
        this._renderVertexes(scaledVertexes, drawOption.color);


    }
    private _renderFragments() {
        this._fragments.forEach(fragment => {
            this._renderFragment(fragment);
        });
    }

    private _updateScale() {
        this._scale += this._delta;
        if (this._scale <= 1){
            this._delta = 0;
            setTimeout(()=>{
                this._delta = DELTA;
            }, 500);
        } else if (this._scale >= this._maxScale){
            this._delta = 0;
            setTimeout(()=>{
                this._delta = -DELTA;
            }, 500);
        }
    }
    render() {
        this._updateScale();
        this._ctx.clearRect(0, 0, this.maxSize, this.maxSize);
        this._renderFragments();
    }
}

export default DiagramRenderer;