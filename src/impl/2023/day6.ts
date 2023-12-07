import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";

interface Race {
    t: number;
    d: number;
}

export default class Day6 extends Solver {

    input: string[];
    races: Race[] = [];


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
    }

    part1(): string | number {
        const l1 = this.input[0].split(/\s+/);
        const l2 = this.input[1].split(/\s+/);
        for (let i = 1; i < l1.length; i++) {
            this.races.push({t: Number.parseInt(l1[i]), d: Number.parseInt(l2[i])});
        }

        return this.count();
    }

    part2(): string | number {
        const l1 = this.input[0].split(/Time:\s+/);
        const l2 = this.input[1].split(/Distance:\s+/);
        for (let i = 1; i < l1.length; i++) {
            this.races.push({t: Number.parseInt(l1[i].replace(/\s+/g,"")), d: Number.parseInt(l2[i].replace(/\s+/g,""))});
        }

        return this.count();
    }

    solve(race: Race): number[] {
        const t = race.t;
        const d = race.d;
        const D = Math.sqrt(t*t-4*d);
        return [(t+D)/2, (t-D)/2];
    }

    count() {
        let ret = 1;
        for (let race of this.races) {
            const ns = this.solve(race);
            const nns = [
                Number.isInteger(ns[0]) ? ns[0] - 1 : Math.floor(ns[0]),
                Number.isInteger(ns[1]) ? ns[1] + 1 : Math.ceil(ns[1]),
            ]

            ret *= (nns[0]-nns[1]+1);
        }
        return ret;
    }

}