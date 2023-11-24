import { Solver } from "../solver";
import { asIntArray } from "../../util/inputParser";

export default class Day1 extends Solver {

    private readonly array: number[];

    constructor(input: string) {
        super(input);
        this.array = asIntArray(input);
    }

    part1(): string | number {
        const f = this.array.filter((v, i) => i > 0 && v > this.array[i-1]);
        return f.length;
    }

    part2(): number {
        const arr2 = this.array.map((v, i) => v+this.array[i+1]+this.array[i+2]).filter(v => !isNaN(v));
        const arr3 = arr2.filter((v, i) => i > 0 && v > arr2[i-1]);
        return arr3.length;
    }

}
