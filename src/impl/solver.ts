export abstract class Solver {

    protected readonly origInput: string;
    protected input: any;

    protected constructor(origInput: string) {
        this.origInput = origInput;
    }

    abstract part1(): string | number;
    abstract part2(): string | number;

}
