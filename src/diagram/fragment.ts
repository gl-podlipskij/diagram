import Vector2 from "./vector.ts";
import {generateSegmentInSquare, intersect, Segment} from "./segment.ts";


type Intersection = {
    point : Vector2;
    edgeIndex : number;
}
class Fragment {
    private readonly _vertexes:Vector2[];

    constructor(vertexes:Vector2[]) {
        if (vertexes.length < 3){
            throw new Error('vertexes must be at least 3');
        }
        this._vertexes = vertexes;
    }

    get vertexes(): Vector2[] {
        return this._vertexes;
    }

    //use all intersection points of a given segment
    // with a fragment
    findIntersections(sector:Segment): Intersection[] {
        const len = this._vertexes.length;

        const intersections:Intersection[] = [];

        //iterate by edges
        let index = 0;
        while (index < len){
            const p1 = this._vertexes[index % len];
            const p2 = this._vertexes[(index+1) % len];

            const edge:Segment = {
                p1,
                p2
            }

            //get intersection with edge
            const intersectionPoint = intersect(edge, sector);
            if (intersectionPoint){
                intersections.push({
                    point : intersectionPoint,
                    edgeIndex : index,
                });
            }

            index++;
        }

        return intersections;
    }

    //returns two parts of a fragment that were formed as a result of sectioning with a segment
    divideBySector(divider:Segment):([Fragment, Fragment]|undefined) {
        const len = this._vertexes.length;

        const intersections = this.findIntersections(divider);
        if (intersections.length !== 2) {
            if (intersections.length > 2){
                debugger;
            }
            return undefined;
        }


        const cutChildFragmentByIntersection = (startIntersection:Intersection, endIntersection:Intersection)=> {
            const startEdge = startIntersection.edgeIndex;
            const endEdge = endIntersection.edgeIndex;

            const vertexes: Vector2[] = [
                startIntersection.point
            ];

            let currentEdgeIndex= startEdge;

            while (currentEdgeIndex !== endEdge){
                const currentVertex = this._vertexes[(currentEdgeIndex+1) % len];
                vertexes.push(currentVertex);
                currentEdgeIndex++;
                currentEdgeIndex %= len;
            }
            vertexes.push(endIntersection.point);

            return new Fragment(vertexes)
        }

        const leftFragment = cutChildFragmentByIntersection(intersections[0], intersections[1]);
        const rightFragment = cutChildFragmentByIntersection(intersections[1], intersections[0]);


        return [leftFragment, rightFragment];
    }

}

//create square fragment
export const newSquareFragment = ()=>{
    return new Fragment([
        new Vector2(0, 0), new Vector2(1, 0),
        new Vector2(1, 1), new Vector2(0, 1),
    ]);
}
export const appendSector = (fragments:Fragment[])=>{
    const sector = generateSegmentInSquare();
    const newFragments:Fragment[] = [];

    for (const fragment of fragments) {
        const next = fragment.divideBySector(sector);
        if (next === undefined) {
            newFragments.push(fragment);
        } else {
            newFragments.push(...next);
        }
    }
    return newFragments;
}
export const generateFragments = (sectorsCount:number)=>{
    let fragments = [newSquareFragment()];
    for (let i = 0; i < sectorsCount; i++){
        fragments = appendSector(fragments);
    }

    return fragments
}
export const getShapeCenter = (vertexes:Vector2[]):Vector2 => {
    let center = new Vector2(0, 0);
    const sc = 1 / vertexes.length;
    for (const vertex of vertexes) {
        center = center.pls(vertex.scl(sc));
    }

    return center;
}
export default Fragment;

