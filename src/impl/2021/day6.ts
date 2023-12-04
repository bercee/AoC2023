import { Solver } from "../solver";
import _ from "lodash";


export default class Day6 extends Solver {


    fishes: number[] = Array(9).fill(0);

    constructor(origInput: string) {
        super(origInput);
        this.origInput.split(",").forEach(s => this.fishes[Number.parseInt(s)]++)
        // console.log(`init: ${this.fishes.join(",")}`);
    }

    part1(): string | number {
        this.iterate(80);
        return _.sum(this.fishes);
    }


    part2(): string | number {
        this.iterate(256);
        return _.sum(this.fishes);
    }

    private iterate(days: number) {
        for (let i = 0; i < days; i++) {
            const zeros = this.fishes[0];
            for (let f = 0; f < 8; f++) {
                this.fishes[f] = this.fishes[f+1];
            }
            this.fishes[8] = zeros;
            this.fishes[6] += zeros;
            // console.log(`day: ${i}, fishes: ${this.fishes.join(",")}`)
        }
    }

}