import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Matrix } from "ts-matrix";
import { minCut } from "../../util/minCut";

export default class Day25 extends Solver {


    graph: number[][];
    nodes = new Map<string, number>();

    constructor(origInput: string) {
        super(origInput);
        const lines = Parsers.asArray(origInput);
        let i = 0;
        for (let line of lines) {
            const ns = line.split(/:? /);
            ns.forEach(n => {
                if (!this.nodes.has(n) ){
                    this.nodes.set(n, i++);
                }
            });
        }

        this.graph = new Matrix(this.nodes.size, this.nodes.size).values;

        for (let line of lines) {
            const ns = line.split(/:? /);
            for (let j = 1; j < ns.length; j++) {
                this.graph[this.nodes.get(ns[0])][this.nodes.get(ns[j])]++;
                this.graph[this.nodes.get(ns[j])][this.nodes.get(ns[0])]++;
            }
        }

    }

    private findMinCut(): {i: number, j: number, cuts: [number, number][]} {
        let cuts;
        for (let i = 0; i < this.nodes.size; i++) {
            for (let j = i+1; j < this.nodes.size; j++) {
                cuts = minCut(this.graph, i, j);
                if (cuts.length === 3) {
                    return {i, j, cuts}
                }
            }
        }
    }

    private cut(cuts: [number, number][]) {
        for (let cut of cuts) {
            this.graph[cut[0]][cut[1]] = 0;
            this.graph[cut[1]][cut[0]] = 0;
        }
    }

    private neighbours(i: number): number[] {
        return this.graph[i].map((j, idx) => idx).filter(idx => this.graph[i][idx] === 1);
    }

    private dfs(start: number, visited: Set<number>) {
        const nexts = this.neighbours(start).filter(n => !visited.has(n));
        for (let next of nexts) {
            visited.add(next);
        }

        for (let next of nexts) {
            this.dfs(next, visited);
        }

    }

    part1(): string | number {
        const {i, j, cuts} = this.findMinCut();
        this.cut(cuts);
        const part1 = new Set<number>();
        const part2 = new Set<number>();
        this.dfs(i, part1);
        this.dfs(j, part2);
        return part1.size * part2.size;
    }

    part2(): string | number {
        return undefined;
    }

}