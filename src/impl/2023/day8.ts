import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { DirectedGraph, MultiDirectedGraph } from "graphology";
import { lcm } from "mathjs";

export default class Day8 extends Solver {

    input: string[]
    directions: string
    graph: DirectedGraph = new MultiDirectedGraph();


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
        this.directions = this.input[0];

        for (let i = 2; i < this.input.length; i++) {
            const node = this.input[i].split(" = ")[0];
            this.graph.addNode(node);
        }

        for (let i = 2; i < this.input.length; i++) {
            const node = this.input[i].split(" = ")[0];
            const pattern = /(...), (...)/;
            const m = this.input[i].match(pattern);
            this.graph.addEdge(node, m[1]);
            this.graph.addEdge(node, m[2]);

        }
    }

    part1(): string | number {
        return this.run("AAA", "ZZZ");
    }

    part2(): string | number {
        return this.graph.nodes().filter(n => n.endsWith("A")).map(n => this.run(n, "Z")).reduce((prev, curr) => lcm(prev, curr));
    }

    private step(i: number): number {
        return this.directions[i%this.directions.length] === "L" ? 0 : 1;
    }

    private run(start: string, endPattern: string): number {
        let node = start;
        let i = 0;
        do {
            node = this.graph.target(this.graph.outEdges(node)[this.step(i)])
            i++;
        } while (!node.endsWith(endPattern))
        return i;
    }

}