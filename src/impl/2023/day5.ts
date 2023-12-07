import { Solver } from "../solver";
import _ from "lodash";


interface Range {
    min: number;
    max: number;
    diff?: number;
}

interface Stage {
    ranges: Range[];
    globalMin: number;
    globalMax: number;
}


export default class Day5 extends Solver {

    seedLine: string;
    stages: Stage[] = [];


    constructor(origInput: string) {
        super(origInput);
        const stages = origInput.split("\n\n");
        this.seedLine = stages[0];
        for (let i = 1; i < stages.length; i++) {
            const lines = stages[i].split("\n");
            const ranges: Range[] = [];
            for (let j = 1; j < lines.length; j++) {
                const data = lines[j].split(/\s+/);
                const min = Number.parseInt(data[1]);
                const max = min + Number.parseInt(data[2]) - 1;
                const diff = Number.parseInt(data[0]) - min;
                ranges.push({min, max, diff});
            }
            const globalMin = _.min(ranges.map(r => r.min));
            const globalMax = _.max(ranges.map(r => r.max));
            this.stages.push({ranges, globalMax, globalMin});
        }

    }

    part1(): string | number {
        const seeds = this.seedLine.split(":")[1].split(/\s+/).map(s => Number.parseInt(s)).splice(1);
        let min = Number.MAX_SAFE_INTEGER;
        for (let s of seeds) {
            const map = this.mapThrough(s);
            // console.log(`${s} --> ${map} <-- ${this.mapBackward(map)}`)
            if (map < min) {
                min = map;
            }
        }
        return min;
    }

    mapThrough(n: number): number {
        let c = n;
        for (let stage of this.stages) {
            const r = this.findRangeFor(c, stage);
            if (r) {
                c += r.diff;
            }
        }
        return c;
    }

    findRangeFor(n: number, s: Stage): Range {
        return s.ranges.find(r => r.min <= n && r.max >= n);
    }


    part2(): string | number {
        const seedsNum = this.seedLine.split(":")[1].split(/\s+/).map(s => Number.parseInt(s)).splice(1);
        const seeds: Range[] = [];
        for (let i = 0; i < seedsNum.length-1; i+=2) {
            const min = seedsNum[i];
            const max = seedsNum[i+1] + min;
            seeds.push({min, max});
        }

        for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
            const m = this.mapBackward(i);
            if (seeds.some(r => r.min<=m && r.max>=m)) {
                return i;
            }
        }
        return undefined;
    }


    private mapBackward(n: number): number {
        let c = n;
        for (let i = this.stages.length - 1; i >= 0; i--) {
            const stage = this.stages[i];
            const r = this.findBackwardRange(stage, c);
            if (r) {
                c-=r.diff;
            }
        }
        return c;
    }


    private findBackwardRange(stage: Stage, c: number): Range {
        return stage.ranges.find(r => r.min + r.diff <= c && r.max + r.diff >= c);
    }
}