import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";
import { transpose } from "../../util/matrixStr";


export default class Day13 extends Solver {
    protected input: string[][][];


    constructor(origInput: string) {
        super(origInput);
        this.input = origInput.split("\n\n").map(d => Parsers.asMatrix(d, ""));
    }

    private hasMirrorAt(m: string[][], axis: number): boolean {
        const subm1 = m.slice(0, axis).reverse();
        const subm2 = m.slice(axis, m.length);

        const minLen = Math.min(subm1.length, subm2.length);
        subm1.splice(minLen)
        subm2.splice(minLen);

        return _.isEqual(subm1, subm2);
    }

    private findHorizAxis(m: string[][]): number {
        for (let i = 1; i < m.length; i++) {
            if (this.hasMirrorAt(m, i)) {
                return i;
            }
        }
        return 0;
    }

    private findVertAxis(m: string[][]): number {
        return this.findHorizAxis(transpose(m));
    }

    part1(): string | number {
        let ret = 0;
        for (let m of this.input) {
            ret += this.findVertAxis(m) + this.findHorizAxis(m)*100
        }
        return ret;
    }

    private changeAt(m: string[][], i: number, j: number): string[][] {
        const ret = _.cloneDeep(m);
        const c = ret[i][j];
        ret[i][j] = c === "#" ? "." : "#";
        return ret;
    }

    part2(): string | number {
        let ret = 0;
        for (let m of this.input) {
            const vertOrig = this.findVertAxis(m);
            const horizOrig = this.findHorizAxis(m);
            let found = false;
            for (let i = 0; i < m.length; i++) {
                for (let j = 0; j < m[0].length; j++) {
                    const changed = this.changeAt(m, i, j);
                    const vert = this.findVertAxis(changed);
                    const horiz = this.findHorizAxis(changed);
                    if (vert !== 0 && vert !== vertOrig) {
                        ret += vert;
                        found = true;
                    } else if (horiz !== 0 && horiz !== horizOrig) {
                        ret += horiz*100;
                        found = true;
                    }
                    if (found) {
                        if ((vert === 0 && horiz === 0) || (vert === vertOrig && horiz === horizOrig)
                            || (vert === 0 && horiz === horizOrig)
                            || (horiz === 0 && vert === vertOrig)) {
                            console.log("baj van")
                        }
                        // console.log(`${i} ${j} ${vert}/${vertOrig} ${horiz}/${horizOrig}`)
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
        }
        return ret;
    }

}