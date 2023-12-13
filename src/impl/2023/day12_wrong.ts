import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";
import { re } from "mathjs";

interface Input {
    str: string;
    segments: number[];
    sum: number;
    arrangements: number;
}

enum Status {
    DONE, HOPELESS, HOPEFUL
}

export default class Day12_wrong extends Solver {

    input: Input[] = [];


    constructor(origInput: string) {
        super(origInput);
        this.parse(origInput);

        // this.step(this.input[1].str, this.input[1]);
        // console.log(this.input[1].arrangements);

    }

    parse(orig: string) {
        const lines = Parsers.asArray(orig);
        for (let line of lines) {
            const dat = line.split(" ");
            const segments = dat[1].split(",").map(s => Number.parseInt(s));
            const str = dat[0];
            this.input.push({segments, str, sum: _.sum(segments), arrangements: 0});
        }
    }


    private recursion(line: string, prev: string, input: Input) {

    }


    private step(line: string, input: Input) {

        if (line.includes("?")) {
            const next1 = line.replace("?", "#");
            const next2 = line.replace("?", ".");
            const status1 = this.getStatus(next1, input);
            const status2 = this.getStatus(next2, input);
            // console.log(`${next1} ${status1}`);
            // console.log(`${next2} ${status2}`);
            if (status1 === Status.DONE) {
                input.arrangements++;
            } else if (status1 === Status.HOPEFUL) {
                this.step(next1, input);
            }

            if (status2 === Status.HOPEFUL) {
                this.step(next2, input);
            }
        }
    }

    private getStatus(line: string, input: Input): Status {
        if (!line.includes("#")) {
            if (_.sum(line.split("").filter(s => s === "?")) < input.sum) {
                return Status.HOPELESS;
            } else {
                return Status.HOPEFUL;
            }
        }
        const pattern = /#+/g;
        const m = line.match(pattern);
        const sum = _.sum(m.map(s => s.length));

        if (sum === input.sum) {
            for (let i = 0; i < m.length; i++) {
                if (m[i].length !== input.segments[i]) {
                    return Status.HOPELESS;
                }
            }
            return Status.DONE;
        }

        if (m[0].length > input.segments[0] && (!line.includes("?") || line.indexOf("#") < line.indexOf("?"))) {
            return Status.HOPELESS;
        }

        if (sum > input.sum) {
            return Status.HOPELESS;
        }


        return Status.HOPEFUL;
    }


    part1(): string | number {
        this.input.forEach(i => {this.step(i.str, i); console.log(`${i.str}, ${i.arrangements}`)});

        return _.sum(this.input.map(i => i.arrangements));
        // return "";
    }

    part2(): string | number {
        return undefined;
    }

}