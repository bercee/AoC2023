import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";

export default class Day1 extends Solver {

    protected input: number[];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asIntArray(this.origInput);
    }

    part1(): string | number {
        const f = this.input.filter((v, i) => i > 0 && v > this.input[i-1]);
        return f.length;
    }

    part2(): number {
        const arr2 = this.input.map((v, i) => v+this.input[i+1]+this.input[i+2]).filter(v => !isNaN(v));
        const arr3 = arr2.filter((v, i) => i > 0 && v > arr2[i-1]);
        return arr3.length;
    }

}
