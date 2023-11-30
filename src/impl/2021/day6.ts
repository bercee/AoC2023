import { Solver } from "../solver";

interface Fish {
    d: number;
}
export default class Day6 extends Solver {

    readonly list: Fish[];

    constructor(origInput: string) {
        super(origInput);
        this.list = origInput.split(",").map(s => Number.parseInt(s)).map(n => {return {d: n}});
    }

    part1(): string | number {
        console.log(this.list.map(f => f.d));
        for (let i = 0; i < 80; i++) {
            this.iterate();
        }
        return this.list.length;
    }

    private iterate() {
        let newFish: Fish[] = [];
        this.list.forEach(f => {
            f.d--;
            if (f.d === -1) {
                f.d = 6;
                newFish.push({d: 8});
            }
        })
        newFish.forEach(f => this.list.push(f));
    }

    part2(): string | number {
        for (let i = 0; i < 256; i++) {
            console.log(`day ${i} fishes ${this.list.length}`)
            this.iterate();
        }
        return this.list.length;
    }

}