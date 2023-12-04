import { Solver } from "../solver";
import _ from "lodash";

export default class Day7 extends Solver {
    input: number[];


    constructor(origInput: string) {
        super(origInput);
        this.input = origInput.split(",").map(s => Number.parseInt(s));
        // console.log(this.input);
    }

    part1(): string | number {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < Math.max(...this.input); i++) {
            const dist = _.sum(this.input.map(n => Math.abs(n-i)));
            if (dist < min) {
                min = dist;
            }

        }
        return min;
    }

    private sumFrom1ToN(n: number): number {
        return (n * (n + 1)) / 2;
    }

    part2(): string | number {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < Math.max(...this.input); i++) {
            const dist = _.sum(this.input.map(n => Math.abs(n-i)).map(n => this.sumFrom1ToN(n)));
            if (dist < min) {
                min = dist;
            }

        }
        return min;
    }

}