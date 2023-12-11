import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Matrix } from "ts-matrix";
import MatrixExt from "../../util/matrixExt";
import _ from "lodash";
import { Point } from "@flatten-js/core";
import { inv, or, re } from "mathjs";

export default class Day11 extends Solver {
    input: number[][];
    expandedInput: number[][];
    matrix: MatrixExt;
    origSize: number;

    fatRows: number[] = [];

    fatCols: number[] = [];

    points: Point[] = [];


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asMatrix(origInput, "").map(l => l.map(s => s === "#" ? 1 : 0));
        const matrix = new MatrixExt(this.input.length, this.input[0].length, _.cloneDeep(this.input));
        this.fatCols = matrix.allColumns().map((c, i) => c.every(n => n === 0) ? i : -1).filter(i => i !== -1);
        this.fatRows = matrix.allRows().map((c, i) => c.every(n => n === 0) ? i : -1).filter(i => i !== -1);
        for (let i = 0; i < this.input.length; i++) {
            for (let j = 0; j < this.input[i].length; j++) {
                if (this.input[i][j] === 1) {
                    this.points.push(new Point(i, j));
                }
            }
        }

    }

    private distance(p1: Point, p2: Point, expansion: number) {
        const xs = [p1.x, p2.x].sort((a, b) => a - b);
        const ys = [p1.y, p2.y].sort((a, b) => a - b);
        const fatRowCount = this.fatRows.filter(r => r > xs[0] && r < xs[1]).length;
        const fatColCount = this.fatCols.filter(r => r > ys[0] && r < ys[1]).length;
        let ret = 0;
        ret += xs[1] - xs[0] + ys[1] - ys[0]
        ret += fatRowCount * (expansion - 1) + fatColCount * (expansion - 1);
        return ret;
    }

    private countAllDist(expansion: number): number {
        let ret = 0;
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                ret += this.distance(this.points[i], this.points[j], expansion);
            }
        }
        return ret;
    }


    part1(): string | number {
        return this.countAllDist(2)
    }

    part2(): string | number {
        return this.countAllDist(1000000);
    }
}