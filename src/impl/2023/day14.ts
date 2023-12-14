import { Solver } from "../solver";
import MatrixExt from "../../util/matrixExt";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

export default class Day14 extends Solver {

    input: MatrixExt;
    //. --> 0
    //O --> 1
    //# --> 2


    constructor(origInput: string) {
        super(origInput);
        this.input = MatrixExt.of(Parsers.asMatrix(origInput, "").map(s => s.map(ss => ss === "." ? 0 : ss === "O" ? 1 : 2)))
    }

    private tiltNorth(vecOrig: number[]): number[] {
        const vec = [...vecOrig];
        const ret: number[] = [];
        let idx = vec.includes(2) ? vec.indexOf(2) : vec.length-1;
        while (vec.length > 0) {
            const above = vec.slice(0, idx+1);
            const count = _.countBy(above);
            count["1"] && ret.push(...Array(count["1"]).fill(1));
            count["0"] && ret.push(...Array(count["0"]).fill(0));
            count["2"] && ret.push(2);
            vec.splice(0, idx+1);
            idx = vec.includes(2) ? vec.indexOf(2) : vec.length-1;
        }


        return ret;
    }

    private tiltAll(m: MatrixExt): MatrixExt {
        const tilted: number[][] = [];
        for (let c of m.allColumns()) {
            tilted.push(this.tiltNorth(c));
        }
        return MatrixExt.of(tilted).transpose();
    }

    private cycleTilt(m: MatrixExt): MatrixExt {
        let ret = this.tiltAll(m);
        ret = ret.rotateRight();
        ret = this.tiltAll(ret);
        ret = ret.rotateRight();
        ret = this.tiltAll(ret);
        ret = ret.rotateRight();
        ret = this.tiltAll(ret);
        return ret.rotateRight();


    }

    private measure(m: MatrixExt): number {
        const values = m.values;
        let ret = 0;
        for (let i = 0; i < values.length; i++) {
            ret += (i+1)*(_.countBy(values[values.length-i-1])["1"] ?? 0)
        }
        return ret;
    }

    part1(): string | number {
        return this.measure(this.tiltAll(this.input));
    }

    part2(): string | number {
        let m = this.input.clone();
        let statuses: number[][][] = [];
        statuses.push(m.values);
        let first;
        let diff;
        for (let i = 0; i < 500; i++) {
            m = this.cycleTilt(m);
            statuses.push(m.values);
            const rep = this.findFirstEqual(statuses);
            if (rep !== undefined) {
                first = rep[0];
                diff = rep[1]-rep[0];
                break;
            }
        }
        const target = 1000000000;

        const modFirst = first % diff;
        const modLast = target % diff;
        const modDiff = (modLast - modFirst) % diff;

        for (let i = 0; i < modDiff; i++) {
            m = this.cycleTilt(m);
        }
        return this.measure(m);


    }

    private findFirstEqual(statuses: number[][][]): [number, number] {
        const last = _.last(statuses);
        for (let i = statuses.length - 2; i >= 0 ; i--) {
            if (_.isEqual(last, statuses[i])) {
                return [i, statuses.length-1];
            }
        }

        return undefined;
    }

    printM(m: MatrixExt) {
        console.log(m.values.map(l => l.join("")).join("\n")
            .replace(/0/g,".")
            .replace(/1/g,"O")
            .replace(/2/g,"#"))
        console.log();
    }

}