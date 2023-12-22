import { Solver } from "../solver";
import _ from "lodash";
import { Parsers } from "../../util/inputParser";
import { HashSet } from "../../util/hashSet";

//DISCLAIMER
//THIS CODE IS INCREDIBLY UGLY AND SLOW, BUT I AM KIND OF FED UP WITH THE ALL THE TASKS I'VE BEEN FALLING BEHIND WITH
//SO I REFUSE TO SPEND MORE TIME ON THIS ONE
//FOR NOW AT LEAST.

class Point3D {

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static of(coords: number[]): Point3D {
        return new Point3D(coords[0], coords[1], coords[2]);
    }

    x: number;
    y: number;
    z: number;

    moveBy(p: Point3D): Point3D {
        return new Point3D(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    hash() {
        return `[${this.x},${this.y},${this.z}]`
    }
}

const DOWN = new Point3D(0, 0, -1);
const UP = new Point3D(0, 0, 1);

function create3DArray(n: number, fillValue: number): number[][][] {
    return _.range(n).map(() =>
        _.range(n).map(() =>
            _.range(n).fill(fillValue)
        )
    );
}

class Brick {
    points: Point3D[];
    readonly i: number;

    constructor(i: number, p1?: Point3D, p2?: Point3D) {
        this.i = i;
        if (p1 !== undefined && p2 != undefined) {
            if (p1.x !== p2.x) {
                const range = _.range(Math.min(p1.x, p2.x), Math.max(p1.x, p2.x) + 1);
                this.points = range.map(v => new Point3D(v, p1.y, p1.z));
            } else if (p1.y !== p2.y) {
                const range = _.range(Math.min(p1.y, p2.y), Math.max(p1.y, p2.y) + 1);
                this.points = range.map(v => new Point3D(p1.x, v, p1.z));
            } else if (p1.z !== p2.z) {
                const range = _.range(Math.min(p1.z, p2.z), Math.max(p1.z, p2.z) + 1);
                this.points = range.map(v => new Point3D(p1.x, p1.y, v));
            } else {
                this.points = [p1];
            }

        } else {
            this.points = [];
        }
    }

    moveBy(p: Point3D): Brick {
        const b = new Brick(this.i);
        for (const element of this.points) {
            b.points.push(element.moveBy(p));
        }
        return b;
    }

    toString() {
        return this.points.map(p => p.hash()).join();
    }
}


export default class Day22 extends Solver {

    origBricks: Brick[] = []

    map: number[][][];

    clone() {
        const day22 = new Day22();
        day22.origBricks = _.cloneDeep(this.origBricks);
        day22.map = _.cloneDeep(this.map);

        return day22;
    }


    constructor(origInput?: string) {
        super(origInput);
        if (origInput) {
            const lines = Parsers.asArray(origInput);
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                const ps = line.split("~");
                const p1coords = ps[0].split(",").map(s => Number.parseInt(s));
                const p2coords = ps[1].split(",").map(s => Number.parseInt(s));
                this.origBricks.push(new Brick(i, Point3D.of(p1coords), Point3D.of(p2coords)));
            }
            const allPoints = this.origBricks.flatMap(b => b.points);

            const idxs = [...allPoints.map(p => p.x), ...allPoints.map(p => p.y), ...allPoints.map(p => p.z)];
            const max = Math.max(...idxs);

            this.map = create3DArray(max, -1);

            this.origBricks.forEach((b) => {
                for (let p of b.points) {
                    this.map[p.x][p.y][p.z] = b.i;
                }
            })
        }

    }

    private moveStuffDown() {

        let movable = this.origBricks.find(b => this.canBeMovedDown(b));
        while (movable !== undefined) {
            this.moveDown(movable);
            movable = this.origBricks.find(b => this.canBeMovedDown(b));
        }

    }


    private canBeMovedDown(b: Brick) {
        if (!b) {
            return false;
        }
        const down = b.moveBy(DOWN);
        return down.points.every(p => {
            const a = this.get(p);
            return p.z > 0 && (a === -1 || a === b.i);
        })
    }

    private get(p: Point3D): number {
        return this.map[p.x][p.y][p.z];
    }

    private set(p: Point3D, i: number) {
        this.map[p.x][p.y][p.z] = i;
    }

    private moveDown(b: Brick) {
        this.freeUp(b);
        const down = b.moveBy(DOWN);
        this.origBricks[b.i] = down;
        this.lock(down);
    }

    private freeUp(b: Brick) {
        b.points.forEach(p => this.set(p, -1));
    }

    private lock(b: Brick) {
        b.points.forEach(p => this.set(p, b.i));
    }


    private canBeDisintegrated(b: Brick): boolean {
        this.freeUp(b);
        const ret = this.origBricks.filter(bb => bb !== b).filter(bb => this.canBeMovedDown(bb));
        this.lock(b);
        return ret.length === 0;
    }


    part1(): string | number {
        this.moveStuffDown();
        //
        // this.canBeMovedDown(this.origBricks[this.origBricks.length - 1], DOWN);
        //
        // return this.origBricks.filter(b => this.canBeDisintegrated(b)).length;
        return this.origBricks.filter(b => this.canBeDisintegrated(b)).length;
    }

    part2(): string | number {
        this.moveStuffDown();

        const disintegrable = this.origBricks.filter(b => this.canBeDisintegrated(b));
        const nonDisintegrable = this.origBricks.filter(b => !disintegrable.includes(b));
        console.log(nonDisintegrable.length);
        let step = 0;
        let ret = 0;
        const startTime = new Date().getTime();
        for (let brick of nonDisintegrable) {
            step++;
            if (step === 10) {
                console.log(new Date().getTime() - startTime);
            }
            console.log(step / nonDisintegrable.length * 100);
            const clone = this.clone();
            clone.disintegrate(brick.i);
            let movables = new HashSet<Brick>(b => `${b.i}`);
            let movable = clone.origBricks.filter(b => b).find(b => clone.canBeMovedDown(b));
            while (movable !== undefined) {
                clone.moveDown(movable);
                movables.add(movable);
                movable = clone.origBricks.filter(b => b).find(b => clone.canBeMovedDown(b));
            }
            ret += movables.size();
        }


        return ret;
    }

    private disintegrate(i: number) {
        const b = this.origBricks[i];
        this.origBricks[i] = undefined;
        this.freeUp(b);
    }
}