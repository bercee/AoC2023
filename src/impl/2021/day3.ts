import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Matrix } from "ts-matrix";
import { columnOf } from "../../util/matrixUtil";


export default class Day3 extends Solver {

    input: number[][];

    m: Matrix;

    constructor(s: string) {
        super(s);
        const lines = Parsers.asArray(s);
        this.input = lines.map(l => l.split('').map(c => c === '1' ? 1 : 0));
        this.m = new Matrix(this.input.length, this.input[0].length, deepCopy2DArray(this.input));
    }


    part1(): string | number {
        let eps = "";
        let gam = "";

        for (let i = 0; i < this.m.columns; i++) {
            const arr = columnOf(this.m, i);
            let bit = arr.filter(n => n === 0).length > this.input.length / 2 ? '0' : '1';
            gam = gam + bit;
            eps = bit === '1' ? eps + '0' : eps + '1';
        }
        console.log(eps);
        console.log(gam)
        return Number.parseInt(eps, 2) * Number.parseInt(gam, 2);
    }


    part2(): string | number {
        let linesInPlay: number[][] = deepCopy2DArray(this.input);
        let newLines: number[][] = [];
        for (let i = 0; i < this.input[0].length && linesInPlay.length > 1; i++) {
            newLines = [];
            const col = columnOf(new Matrix(linesInPlay.length, linesInPlay[0].length, deepCopy2DArray(linesInPlay)), i);
            let bit = col.filter(n => n === 0).length > linesInPlay.length / 2 ? 0 : 1;
            newLines = linesInPlay.filter(l => l[i] === bit);
            linesInPlay = newLines;
        }
        const one = Number.parseInt(linesInPlay[0].join(""),2);

        linesInPlay = deepCopy2DArray(this.input);
        for (let i = 0; i < this.input[0].length && linesInPlay.length > 1; i++) {
            newLines = [];
            const col = columnOf(new Matrix(linesInPlay.length, linesInPlay[0].length, deepCopy2DArray(linesInPlay)), i);
            let bit = col.filter(n => n === 0).length > linesInPlay.length / 2 ? 1 : 0;
            newLines = linesInPlay.filter(l => l[i] === bit);
            linesInPlay = newLines;
        }
        const two = Number.parseInt(linesInPlay[0].join(""),2);
        return one*two;
    }

}

function deepCopy2DArray(originalArray: number[][]): number[][] {
    return originalArray.map(row => [...row]);
}