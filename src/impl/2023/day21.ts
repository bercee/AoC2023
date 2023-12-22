import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Point, Vector } from "@flatten-js/core";
import { HashSet } from "../../util/hashSet";
import _ from "lodash";

const UP = new Vector(-1, 0);
const DOWN = new Vector(1, 0);
const LEFT = new Vector(0, -1);
const RIGHT = new Vector(0, 1);

const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

export default class Day21 extends Solver {

    map: number[][];
    N: number;

    start: Point;

    constructor(origInput: string) {
        super(origInput);
        this.map = Parsers.asMatrix(origInput, "").map((l, row) => l.map((c, col) => {
            if (c === "S") {
                this.start = new Point(row, col);
            }
            return c === "#" ? 1 : 0;
        }))

        this.N = this.map.length;


    }

    part1(): string | number {
        const m = this.emptyMatrix();
        this.setValue(m, this.start, 0);
        const ret = this.fillAMatrix(m, this.start, 64);
        return this.count(ret, 0);
    }

    private emptyMatrix(): number[][] {
        return _.times(this.N, () => _.times(this.N, _.constant(undefined)));
    }

    private nextSteps(p: Point): Point[] {
        return DIRECTIONS.map(d => p.translate(d)).filter(p => this.isIn(p)).filter(p => this.isFree(p));
    }


    private isFree(p: Point): boolean {
        return this.map[p.x][p.y] === 0;
    }

    private isIn(p: Point): boolean {
        return p.x >= 0 && p.x < this.N && p.y >= 0 && p.y < this.N;
    }

    private fillAMatrix(origM: number[][], start: Point, stop?: number): number[][] {
        const retM = _.cloneDeep(origM);
        let currents = [start];
        let step = this.getValue(retM, start)

        while (currents.length > 0 && (stop === undefined || step <= stop)) {
            step++;
            let nextsSet = new HashSet<Point>();
            for (let current of currents) {
                const neighbours = this.nextSteps(current);
                for (let neighbour of neighbours) {
                    if (this.getValue(retM, neighbour) === undefined) {
                        this.setValue(retM, neighbour, step)
                        nextsSet.add(neighbour);
                    }
                }
            }
            currents = nextsSet.toArray();
        }
        return retM;
    }

    private getValue(m: number[][], p: Point) {
        return m[p.x][p.y];
    }

    private setValue(m: number[][], p: Point, v: number) {
        m[p.x][p.y] = v;
    }

    private count(m: number[][], mod: number): number {
        return m.flatMap(l => l).filter(n => n !== undefined && n % 2 === mod).length;
    }

    part2(): string | number {
        let centerMatrix = this.emptyMatrix();
        this.setValue(centerMatrix, this.start, 0);
        centerMatrix = this.fillAMatrix(centerMatrix, this.start);
        const middleIdx = (this.N - 1) / 2;

        //number of [even, odd] distances in a matrix with ODD manhattan dist from center matrix
        const evenManhDistsSum = [this.count(centerMatrix, 0), this.count(centerMatrix, 1)];
        //number of [even, odd] distances in a matrix with EVEN manhattan dist from center matrix
        const oddManhDistsSum = [evenManhDistsSum[1], evenManhDistsSum[0]];


        const STEPS = 26501365;
        const MOD = STEPS % 2;

        //get ds for which minAxial <= STEPS <= maxAxial
        const partialAxialDs = _.range(Math.ceil((STEPS - 130) / 131), Math.floor((STEPS + 65) / 131) + 1);
        const partialDiagonalDs = _.range(Math.ceil((STEPS - 130) / 131), Math.floor((STEPS + 130) / 131) + 1);


        let ret = 0;

        //sum up number of places in matrixes that are fully covered
        const fullyIncludedD = Math.min(...partialDiagonalDs, ...partialAxialDs) - 1;

        const analResultCovered = analyzeExtendedMaps(fullyIncludedD);
        ret += analResultCovered.odds * oddManhDistsSum[MOD];
        ret += analResultCovered.evens * evenManhDistsSum[MOD];

        const axisStartPoints = [
            new Point(0, middleIdx),
            new Point(middleIdx, 0),
            new Point(this.N - 1, middleIdx),
            new Point(middleIdx, this.N - 1)
        ]

        const cornerStartPoints = [
            new Point(0, 0),
            new Point(0, this.N - 1),
            new Point(this.N - 1, 0),
            new Point(this.N - 1, this.N - 1)
        ]

        //sum up partially covered axial matrixes

        for (let partialAxialD of partialAxialDs) {
            const {minAxial} = calculateMinMaxDists(partialAxialD);
            ret += _.sum(axisStartPoints.map(start => {
                let m = this.emptyMatrix();
                this.setValue(m, start, minAxial);
                return this.fillAMatrix(m, start, STEPS);
            }).map(m => this.count(m, MOD)));
        }


        //sum up partially covered diagonal matrixes

        for (let partialDiagonalD of partialDiagonalDs) {
            const {minDiagonal} = calculateMinMaxDists(partialDiagonalD);
            const matrixesOnQuarterDiagonal = partialDiagonalD - 1;
            ret += _.sum(cornerStartPoints.map(start => {
                let m = this.emptyMatrix();
                this.setValue(m, start, minDiagonal);
                return this.fillAMatrix(m, start, STEPS);
            }).map(m => matrixesOnQuarterDiagonal*this.count(m, MOD)));
        }


        return ret;
    }
}

interface MinMaxDists {
    minAxial: number,
    maxAxial: number,
    minDiagonal: number,
    maxDiagonal: number;
}

function calculateMinMaxDists(d: number): MinMaxDists {
    const minAxial = 131 * d - 65;
    const maxAxial = 131 * d + 130;
    const minDiagonal = 131 * d - 130;
    const maxDiagonal = 131 * d + 130;

    return { minAxial, maxAxial, minDiagonal, maxDiagonal };
}


interface AnalResult {
    area: number,
    boundary: number,
    internal: number,
    totalCovered: number,
    diagonalBoundary: number,
    evens: number,
    odds: number

}


function analyzeExtendedMaps(ext: number): AnalResult {
    const area = 2 * ext * ext;
    const boundary = 4 + 4 * (ext - 1);
    const internal = area + 1 - boundary / 2;
    const totalCovered = boundary + internal;
    const diagonalBoundary = 4 * (ext - 1);
    const totalSameMods = (ext + 1) * (ext + 1);
    const totalOtherMods = (ext) * (ext);
    const totalMods = totalSameMods + totalOtherMods;
    if (totalMods !== totalCovered) {
        throw new Error("sry")
    }
    const evens = ext % 2 === 0 ? totalSameMods : totalOtherMods;
    const odds = ext % 2 === 1 ? totalSameMods : totalOtherMods;

    return { area, boundary, internal, totalCovered, diagonalBoundary, evens, odds };


}

