import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

interface Input {
    str: string;
    segments: number[];
}

export default class Day12 extends Solver {

    input: Input[] = [];
    cache = new Map<string, number>();

    constructor(origInput: string) {
        super(origInput);
        this.parse(origInput);

    }

    parse(orig: string) {
        const lines = Parsers.asArray(orig);
        for (let line of lines) {
            const dat = line.split(" ");
            const segments = dat[1].split(",").map(s => Number.parseInt(s));
            const str = dat[0];
            this.input.push({segments, str});
        }
    }

    recursion(line: string, segments: number[]) {
        const status = `${line} ${segments.join(",")}`;
        const v = this.cache.get(status);
        if (v !== undefined) {
            return v;
        }

        if (segments.length > 0) {
            const idx = line.search(/[\#|\?]/);
            if (idx >= 0) {
                const max = line.length - (_.sum(segments) + segments.length - 1);
                let res = 0;
                for (let i = idx; i <= max; i++) {

                    let found = false;
                    for (let j = 0; j < i; j++) {
                        if (line[j] === "#") {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        break;
                    }
                    const substr = line.substring(i,i + segments[0]);
                    const sepa = line[i+segments[0]];
                    if (substr.length === segments[0] && /^[#?]+$/.test(substr) && (sepa === undefined || sepa === "?" || sepa === ".")) {
                        const remainder = line.substring(i + segments[0] + 1);
                        const remainderSegs = [...segments].splice(1, segments.length-1);
                        if (remainderSegs.length === 0 && remainder.split("").every(s => s !== "#")) {
                            res++;
                        } else if (remainder.length > 0) {
                            res += this.recursion(remainder, remainderSegs);
                        }
                    }
                }
                this.cache.set(status, res);
                return res;
            }
        }
        return 0;
    }

    part1(): string | number {
        let c = 0;
        for (let i of this.input) {
            c += this.recursion(i.str, i.segments);
        }

        return c;
    }

    part2(): string | number {
        const unfolded: Input[] = this.input.map(i => {return{
            str: `${i.str}?${i.str}?${i.str}?${i.str}?${i.str}`,
            segments: [...i.segments, ...i.segments, ...i.segments, ...i.segments, ...i.segments]
        }})

        let c = 0;
        for (let i of unfolded) {
            c += this.recursion(i.str, i.segments);
        }
        return c;
    }
}
