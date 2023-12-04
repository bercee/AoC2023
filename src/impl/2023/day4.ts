import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

interface Card {
    winning: number[]
    mine: number[];
}
export default class Day4 extends Solver {

    input: string[];
    cards: Card[] = [];
    instances: number[] = [];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
        this.parse();
    }

    part1(): string | number {
        let res = 0;
        this.cards.forEach(c => {
            const occ = c.mine.filter(m => new Set(c.winning).has(m)).length;
            if (occ > 0) {
                res += Math.pow(2, occ-1);
            }
        })
        return res;
    }

    part2(): string | number {
        for (let i = 0; i < this.cards.length; i++) {
            const c = this.cards[i];
            const occ = c.mine.filter(m => new Set(c.winning).has(m)).length;
            for (let j = i + 1; j < Math.min(i+1+occ, this.instances.length); j++) {
                this.instances[j]+=this.instances[i];
            }
        }
        return _.sum(this.instances);
    }


    private parse() {
        this.input.forEach(l => {
            const numStr = l.split(":")[1].trim().split("|");
            let w: number[] = [];
            let m: number[] = [];
            numStr[0].trim().split(/\s+/).forEach(n => {
                w.push(Number.parseInt(n));
            });
            numStr[1].trim().split(/\s+/).forEach(n => {
                m.push(Number.parseInt(n));
            });
            this.cards.push({winning: w, mine: m});
        })
        this.instances = Array(this.cards.length).fill(1);
    }
}