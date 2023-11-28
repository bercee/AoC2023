import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Matrix } from "ts-matrix";
import { columnOf, rowOf } from "../../util/matrixUtil";

export default class Day4 extends Solver {

    input: string[];
    origString: string;
    private numbers: number[];
    private matrixes: Matrix[];
    private hits: Matrix[];


    protected parse(input: string): any {
        this.origString = input;
        this.input = Parsers.asArray(input);
        this.load();
    }

    private load() {
        this.numbers = this.input[0].split(",").map(s => Number.parseInt(s));
        const blocks = this.origString.split("\n\n");
        this.matrixes = [];
        this.hits = [];
        for (let i = 1; i < blocks.length; i++) {
            const lines = blocks[i].split("\n");
            this.matrixes.push(new Matrix(5, 5, lines.map(l => l.trim().split(/\s+/).map(s => Number.parseInt(s)))))
            this.hits.push(new Matrix(5, 5))
        }
    }



    part1(): string | number {
        for (const element of this.numbers) {
            const n = element;
            this.call(n);
            if (n === 24) {
                let i = 0;
            }
            const winner = this.hits.find(m => this.hasBingo(m));
            if (winner) {
                const i = this.hits.indexOf(winner);
                return this.countUnmarkedSum(i) * n;
            }
        }
        return 0;
    }

    private call(n: number) {
        this.matrixes.forEach((m, i) => {
            m.values.forEach((nums, row) => {
                nums.forEach((v, col) => {
                    if (v === n) {
                        this.hits[i].values[row][col] = 1;
                    }
                })
            })
        })
    }

    private hasBingo(m: Matrix): boolean {
        for (let i = 0; i < m.columns; i++) {
            if (columnOf(m, i).every(v => v ===1)) {
                return true;
            }
        }
        for (let i = 0; i < m.rows; i++) {
            if (rowOf(m, i).every(v => v ===1)) {
                return true;
            }
        }
        return false;
    }

    private countUnmarkedSum(i: number): number {
        let sum = 0;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.hits[i].at(row, col) === 0) {
                    sum += this.matrixes[i].at(row, col);
                }
            }
        }
        return sum;
    }

    private countUnmarkedSum2(m: Matrix, hits: Matrix): number {
        let sum = 0;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (hits.at(row, col) === 0) {
                    sum += m.at(row, col);
                }
            }
        }
        return sum;
    }

    part2(): string | number {
        let lastWinner;
        let lastHits;
        for (const element of this.numbers) {
            const n = element;
            this.call(n);
            if (n === 24) {
                let i = 0;
            }
            const winners = this.hits.filter(m => this.hasBingo(m));
            for (let winner of winners) {
                const i = this.hits.indexOf(winner);
                this.matrixes.splice(i, 1);
                this.hits.splice(i, 1);
            }
            if (this.matrixes.length === 1) {
                lastWinner = this.matrixes[0];
                lastHits = this.hits[0];
            }

            if (this.matrixes.length === 0) {
                return this.countUnmarkedSum2(lastWinner as Matrix, lastHits as Matrix) * n;
            }

        }
        return 0;
    }

}