import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Point, Vector } from "@flatten-js/core";
import { HashSet } from "../../util/hashSet";
import _ from "lodash";
import { re } from "mathjs";

const UP = new Vector(-1, 0);
const DOWN = new Vector(1, 0);
const LEFT = new Vector(0, -1);
const RIGHT = new Vector(0, 1);

const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

export default class Day21 extends Solver {

    map: number[][];
    width: number;
    height: number;

    start: Point;

    shortestDistsBase: number[][]

    constructor(origInput: string) {
        super(origInput);
        this.map = Parsers.asMatrix(origInput, "").map((l, row) => l.map((c, col) => {
            if (c === "S") {
                this.start = new Point(row, col);
            }
            return c === "#" ? 1 : 0;
        }))

        this.height = this.map.length;
        this.width = this.map[0].length;


    }

    private nextSteps(p: Point): Point[] {
        return DIRECTIONS.map(d => p.translate(d)).filter(p => this.isIn(p)).filter(p => this.isFree(p));
    }

    private isFree(p: Point): boolean {
        return this.map[p.x][p.y] === 0;

    }


    private isIn(p: Point): boolean {
        return p.x >= 0 && p.x < this.height && p.y >= 0 && p.y < this.width;
    }

    private findReachablesFrom(start: Point, max: number): Point[] {
        const visited: HashSet<Point> = new HashSet<Point>();
        visited.add(start);
        let nexts = [start];
        for (let i = 0; i < max; i++) {
            const nextSet = new HashSet<Point>();
            for (let next of nexts) {
                const nextNexts = this.nextSteps(next).filter(p => !visited.has(p))
                nextNexts.forEach(n => nextSet.add(n));
            }

            nexts = nextSet.toArray();


            for (let next of nexts) {
                visited.add(next);
            }
        }
        return visited.toArray();
    }


    part1(): string | number {
        return this.findReachablesFrom(this.start, 64).filter(p => manhattanDist(p, this.start) % 2 === 0).length;
    }

    private fillAMatrix2(origM: number[][], starts: Point[]): number[][] {
        const retM = _.cloneDeep(origM);
        let currents = starts;

        while (currents.length > 0) {
            let nextsSet = new HashSet<Point>();
            for (let current of currents) {
                const neighbours = this.nextSteps(current);
                for (let neighbour of neighbours) {
                    if (this.getValue(retM, neighbour) === undefined) {
                        this.setValue(retM, neighbour, this.getValue(retM, current)+1)
                        nextsSet.add(neighbour);
                    } else {
                        const existingV = this.getValue(retM, neighbour);
                        const newV = this.getValue(retM, current) + 1;
                        if (newV < existingV) {
                            this.setValue(retM, neighbour, newV);
                            nextsSet.add(neighbour);
                        }
                    }
                }
            }
            currents = nextsSet.toArray();
        }


        return retM;
    }

    private fillAMatrix(origM: number[][], start: Point): number[][] {
        const retM = _.cloneDeep(origM);
        let nexts = [start];
        let step = retM[start.x][start.y];


        while (nexts.length > 0) {
            step++;
            const nextSet = new HashSet<Flatten.Point>();
            for (let next of nexts) {
                const nextNexts = this.nextSteps(next).filter(p => retM[p.x][p.y] === undefined);
                nextNexts.forEach(p => {
                    nextSet.add(p);
                    retM[p.x][p.y] = step;
                });
            }
            nexts = nextSet.toArray();
        }

        return retM;
    }

    private fillMatrixFromExisting(origM: number[][]): number[][] {
        const startPoints = this.findDefinedPoints(origM);
        return this.fillAMatrix2(origM, startPoints);
    }

    private findDefinedPoints(m: number[][]): Point[] {
        const ret: Point[] = [];
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                if (m[i][j] !== undefined) {
                    ret.push(new Point(i, j));
                }
            }
        }

        return ret;

    }

    private emptyMatrix() {
        return _.times(this.height, () => _.times(this.width, _.constant(undefined)));
    }

    private createProfile(v: number[]): number[] {
        const min = Math.min(...v.filter(n => n !== undefined));
        return v.map(n => n === undefined ? undefined : n - min);
    }

    private findPeriodicityDown(baseM: number[][]): {first: number; period: number} {
        const lastVs: number[][] = [];
        let lastV = _.last(baseM);
        lastVs.push(this.createProfile(lastV));
        let repetition = this.findRepetition(lastVs);

        let newM;

        while (true) {
            if (repetition !== undefined) {
                return repetition;
            }
            newM = this.emptyMatrix();
            newM[0] = lastV.map(n => n !== undefined ? n + 1: undefined);
            newM = this.fillMatrixFromExisting(newM);
            lastV = _.last(newM);
            lastVs.push(this.createProfile(lastV));
            repetition = this.findRepetition(lastVs);
        }
    }

    private findRepetition(lastVs: number[][]): {first: number; period: number} {
        if (lastVs.length <= 1) {
            return undefined;
        }

        for (let i = lastVs.length - 2; i >= 0; i--) {
            for (let j = i +1 ; j < lastVs.length; j++) {
                if (_.isEqual(lastVs[i], lastVs[j])) {
                    return  {
                        first: i, period: j-i
                    }
                }
            }
        }

        return undefined;


    }

    part2(): string | number {
        const emptyM = this.emptyMatrix();
        emptyM[this.start.x][this.start.y] = 0;
        this.shortestDistsBase = this.fillAMatrix2(emptyM, [this.start]);


        console.log(this.findPeriodicityDown(this.shortestDistsBase));

        return undefined;
    }

    private getValue(m: number[][], p: Point) {
        return m[p.x][p.y];
    }

    private setValue(m: number[][], p: Point, v: number) {
        m[p.x][p.y] = v;
    }
}

function manhattanDist(p1: Point, p2: Point) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
