import { Parsers } from "../util/inputParser";

export abstract class Solver {

    protected readonly input: any;

    protected constructor(input: string) {
        this.input = this.parse(input);
    }

    abstract part1(): string | number;
    abstract part2(): string | number;

    protected abstract parse(input: string): any;
}

export abstract class DefaultSolver extends Solver{
    protected parse(input: string): string[] {
        return Parsers.asArray(input);
    }
}