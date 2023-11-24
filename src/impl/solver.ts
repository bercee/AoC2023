export abstract class Solver {

    protected readonly input: string;
    protected constructor(input: string) {
        this.input = input;
    }
    abstract part1(): string | number;
    abstract part2(): string | number;
}