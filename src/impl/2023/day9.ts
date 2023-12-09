import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

export default class Day9 extends Solver {

    input: number[][];


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asIntMatrix(origInput);
    }

    part1(): string | number {
        return _.sum(this.input.map(arr => this.extrapolate(arr)).map(arr => _.last(arr)));
    }

    private extrapolate(arr: number[]): number[] {
        if (arr.every(n => n === 0)) {
            return [...arr, 0];
        } else {
            return [...arr, _.last(arr) + _.last(this.extrapolate(this.diff(arr)))];
        }
    }

    private extrapolateBack(arr: number[]): number[] {
        if (arr.every(n => n === 0)) {
            return [0, ...arr];
        } else {
            return [arr[0]-(this.extrapolateBack(this.diff(arr)))[0],...arr];
        }
    }

    private diff(arr: number[]): number[] {
        return arr.map((v,i) => arr[i+1] - arr[i]).filter(n => !Number.isNaN(n));
    }

    part2(): string | number {
        return _.sum(this.input.map(arr => this.extrapolateBack(arr)).map(arr => arr[0]));
    }

}