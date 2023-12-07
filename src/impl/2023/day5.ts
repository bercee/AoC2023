import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

interface RangeMap {
    min: number,
    max: number,
    diff: number
}


interface MapSegm {
    destStart: number;
    sourceStart: number;
    range: number;
}
class Mapper {
    segments: MapSegm[] = [];
    get(n: number): number {
        const segm = this.segments.find(s => n >= s.sourceStart && n <= s.sourceStart + s.range);
        if (segm) {
            return n + (segm.destStart-segm.sourceStart);
        } else {
            return n;
        }
    }
}

export default class Day5 extends Solver {

    input: string[]

    seeds: number[];

    map: Map<string, Mapper> = new Map([

    ]);



    ranges: RangeMap[] = [];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
        this.seeds = this.input[0].split(":")[1].trim().split(/\s+/).map(s => Number.parseInt(s));

        const data = this.origInput.replace(/seeds: .*\n\n/,"");
        const parts = data.split(/\n\n/);
        for (let part of parts) {
            this.parse(part);
        }

        // console.log(this.map)
    }

    static rangeOf(min: number, max: number, diff: number): RangeMap {
        return {min, max, diff}
    }

    private addRange(r: RangeMap) {

        //first range
        if (!this.ranges.length) {
            this.ranges.push(r);
            return;
        }

        //if no overlap
        let first = this.ranges[0];
        let last = _.last(this.ranges);
        if (r.max < first.min) {
            if (first.min - r.max > 1) {
                this.ranges.splice(0, 0, Day5.rangeOf(r.max+1, first.min-1, 0))
            }
            this.ranges.splice(0, 0, r);
            return;
        }
        if (r.min > last.max){
            if (r.min - last.max > 1) {
                this.ranges.push(Day5.rangeOf(last.max + 1, r.min - 1, 0))
            }
            this.ranges.push(r);
            return;
        }

        //prepare ranges

        if (r.min < first.min && r.max >= first.max) {
            this.ranges.splice(0, 0, Day5.rangeOf(r.min, first.min-1, 0));
        }

        if (r.max > last.max && r.min <= last.max) {
            this.ranges.push(Day5.rangeOf(last.max+1, r.max, 0));
        }

        //split existing
        let rangeOfMinIdx = this.ranges.findIndex(c => c.min <= r.min && c.max >= r.min);






    }

    part1(): string | number {
        let min = Number.MAX_SAFE_INTEGER;
        // for (let seed of this.seeds) {
        const start = _.min(this.seeds);
        const end = _.max(this.seeds)*2;
        console.log(`${start} ${end} ${end-start} ${Number.MAX_SAFE_INTEGER}`)
        for (let seed = start; seed < end; seed++) {
            const perc = (seed-start) / (end-start) * 100;
            // console.log(perc);
            let v = seed;
            for (let mapKey of this.map.keys()) {
                const map = this.map.get(mapKey);
                v = map.get(v) ?? v;
                // console.log(`    ${v}`)
            }
            // console.log(`seed ${seed} ==> ${v}`)
            if (v < min) {
                min = v;
                console.log(min)
            }
        }
        return min;
    }

    part2(): string | number {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < this.seeds.length-1; i+=2) {
            // console.log(i)
            for (let seed = this.seeds[i]; seed < this.seeds[i]+this.seeds[i+1]; seed+=this.seeds[i+1]-1) {
                // console.log(seed);
                let v = seed;
                for (let mapKey of this.map.keys()) {
                    const map = this.map.get(mapKey);
                    v = map.get(v) ?? v;
                    // console.log(`    ${v}`)
                }
                // console.log(`seed ${seed} ==> ${v}`)
                if (v < min) {
                    min = v;
                }
            }
        }

        return min;

    }

    private parse(part: string) {
        const hb = part.split(":\n");
        const title = hb[0].split(" ")[0];
        // console.log(title);
        // const map = new Map<number, number>();
        const map = new Mapper();
        // console.log(hb[1])
        const ranges = hb[1].split("\n");
        for (let range of ranges) {
            const v = range.split(" ").map(s => Number.parseInt(s));
            map.segments.push({destStart: v[0], sourceStart: v[1], range: v[2]})
            // for (let i = 0; i < v[2]; i++) {
            //     map.set(v[1]+i, v[0]+i);
            // }
        }
        this.map.set(title, map);
    }
}