import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";
import { Matrix } from "ts-matrix";
import permutations from "just-permutations";

interface Input {
    str: string;
    segments: number[];
    // sum: number;
    // arrangements: number;
}

export default class Day12 extends Solver {

    input: Input[] = [];


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

    private distributions(input: Input): number[][] {
        const k = input.segments.length + 1;
        const n = input.str.length - (_.sum(input.segments.map(s => s+1))-1)
        // console.log(`n: ${n}, k: ${k}`)
        const combinations = generatePartitions(n, k);
        // console.log(combinations.length);
        const matrix = new Matrix(combinations.length, combinations[0].length, combinations);
        const combiT = matrix.transpose().values;
        for (let i = 1; i < combiT.length-1; i++) {
            combiT[i] = combiT[i].map(n => n+1);
        }
        for (let i = 0; i < input.segments.length; i++) {
            combiT.splice(i*2+1, 0, Array(combinations.length).fill(input.segments[i]))
        }
        return new Matrix(combiT.length, combiT[0].length, combiT).transpose().transpose().transpose().values;
    }

    private testLine(nums: number[], line: string) {
        let start = 0;
        for (let i = 0; i < nums.length; i++) {
            const c = i % 2 === 0 ? '.' : "#";
            for (let k = start; k <= start + nums[i] - 1; k++) {
                if (!(line[k] === "?" || line[k] === c)){
                    return false;
                }
            }
            start += nums[i];
        }
        return true;
    }

    part1(): string | number {
        let c = 0;
        for (let i of this.input) {

            const counts = {c: 0};
            this.recursion(i.str, i.segments, counts);
            // console.log(`${i.str} ${i.segments.join(",")} => ${counts.c}`)
            c += counts.c;

            let dist = this.distributions(i);
            let dist2 = dist.filter(n => this.testLine(n, i.str));
            const res = dist2.length;

            if (counts.c !== res) {

                console.log(`${i.str} ${i.segments.join(",")} => ${counts.c} (bad) vs ${res} (good)`)
            }
        }

        return c;
    }

    // part1(): string | number {
    //     return _.sum(this.input.map(i => this.distributions(i).filter(nums => this.testLine(nums, i.str)).length))
    // }

    recursion(line: string, segments: number[], counts: {c: number}) {
        if (segments.length > 0) {
            const idx = line.search(/[\#|\?]/);
            if (idx >= 0) {
                const max = line.length - (_.sum(segments) + segments.length - 1);
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
                            counts.c++;
                        }else if (remainder.length > 0){
                            this.recursion(remainder, remainderSegs, counts);
                        }
                    }
                }
            }
        }
    }

    part2(): string | number {


        const unfolded: Input[] = this.input.map(i => {return{
            str: `${i.str}?${i.str}?${i.str}?${i.str}?${i.str}`,
            segments: [...i.segments, ...i.segments, ...i.segments, ...i.segments, ...i.segments]
        }})

        let c = 0;
        for (let i of unfolded) {


            const counts = { c: 0 };
            this.recursion(i.str, i.segments, counts);
            console.log(`${i.str} ${i.segments.join(",")} => ${counts.c}`)
            c += counts.c;
        }
        // for (let i of unfolded) {
        //     const k = i.segments.length + 1;
        //     const n = i.str.length - (_.sum(i.segments.map(s => s+1))-1)
        //     let partitions: number[][];
        //     if (n === 0) {
        //         partitions = [Array(k).fill(0)];
        //     } else {
        //         partitions = getAllUniquePartitions(n, k);
        //         partitions.forEach(p => {
        //             while (p.length < k) {
        //                 p.push(0);
        //             }
        //         });
        //     }
        //     console.log(`n: ${n}, k: ${k}, partitions: ${partitions.length}`)
        //     for (const p of partitions) {
        //         // console.log(p);
        //         let perm = permutations(p);
        //         const f = perm.length;
        //         const permStr = perm.map(n => n.join(","));
        //         const set = new Set<string>;
        //         permStr.forEach(p => set.add(p));
        //         perm = [...set].map(s => s.split(",").map(ss => Number.parseInt(ss)));
        //         console.log(`${f} --> ${perm.length}`)
        //     }
        //
        // }
        return c;

        // return _.sum(unfolded.map(i => this.distributions(i).filter(nums => this.testLine(nums, i.str)).length));
    }

}

function generateCombinations(n: number, k: number): number[][] {
    // Initialize an array to store combinations
    const combinations: number[][] = [];

    // Helper function to generate combinations recursively
    function generateHelper(currentCombination: number[], remainingSum: number, remainingVariables: number) {
        // Base case: all variables are assigned
        if (remainingVariables === 0) {
            if (remainingSum === 0) {
                combinations.push([...currentCombination]);
            }
            return;
        }

        // Recursive case: assign a value to the current variable
        for (let i = 0; i <= remainingSum; i++) {
            currentCombination.push(i);
            generateHelper(currentCombination, remainingSum - i, remainingVariables - 1);
            currentCombination.pop();
        }
    }

    // Start the recursive generation
    generateHelper([], n, k);

    return combinations;
}

function generatePartitions(n: number, k: number, currentPartition: number[] = [], allPartitions: number[][] = []): number[][] {
    if (k === 0) {
        if (n === 0) {
            allPartitions.push([...currentPartition]);
        }
        return allPartitions;
    }

    for (let i = 0; i <= n; i++) {
        currentPartition.push(i);
        generatePartitions(n - i, k - 1, currentPartition, allPartitions);
        currentPartition.pop();
    }

    return allPartitions;
}

function getAllUniquePartitions(n: number, k: number): number[][] {
    const result: number[][] = [];

    function generatePartitions(): void {
        const p: number[] = new Array(n);
        let k: number = 0;
        p[k] = n;

        while (true) {
            result.push([...p.slice(0, k + 1)]);

            let rem_val: number = 0;

            while (k >= 0 && p[k] === 1) {
                rem_val += p[k];
                k--;
            }

            if (k < 0) {
                return;
            }

            p[k]--;
            rem_val++;

            while (rem_val > p[k]) {
                p[k + 1] = p[k];
                rem_val -= p[k];
                k++;
            }

            p[k + 1] = rem_val;
            k++;
        }
    }

    generatePartitions();
    return result.filter(nn => nn.length <= k);
}
