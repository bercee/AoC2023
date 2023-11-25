import { Solver } from "../solver";
import { asIntArray } from "../../util/inputParser";

export default class Day2 extends Solver {

    private readonly array: number[];

    constructor(input: string) {
        super(input);
        this.array = asIntArray(input);
    }

    part1(): string | number {
        return "";
    }

    part2(): string | number {
        return "";
    }

}
