import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Vector } from "ts-matrix";

export default class Day2 extends Solver {

    input: string[][];

    private steps: Array<Vector> = [];

    constructor(props: string) {
        super(props.replace(/\n$/,""));
        this.input = Parsers.asMatrix(this.origInput);
        this.parseSteps();
    }


    part1(): string | number {
        // console.log(this.steps);
        let p = new Vector([0,0]);
        this.steps.forEach(s => p = p.add(s));
        // console.log(p)
        return  p.at(0) * p.at(1);
    }


    part2(): string | number {
        let h = 0;
        let d = 0;
        let a = 0;
        this.input.forEach(l => {
            if (l[0].startsWith("f")) {
                h+=Number.parseInt(l[1]);
                d+=(a*Number.parseInt(l[1]))
            } else if (l[0].startsWith("d")) {
                a+=Number.parseInt(l[1]);
            } else {
                a-=Number.parseInt(l[1]);
            }
        })
        return h*d;
    }

    private parseSteps() {
        this.input.forEach(l => {
            if (l[0].startsWith("f")) {
                this.steps.push(new Vector([Number.parseInt(l[1]), 0]));
            } else if (l[0].startsWith("d")) {
                this.steps.push(new Vector([0, Number.parseInt(l[1])]));
            } else {
                this.steps.push(new Vector([0, -Number.parseInt(l[1])]));
            }
        })
    }

}
