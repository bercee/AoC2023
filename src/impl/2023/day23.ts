import { Solver } from "../solver";
import { Point, Vector } from "@flatten-js/core";
import { Parsers } from "../../util/inputParser";
import Graph, { DirectedGraph, UndirectedGraph } from "graphology";
import { HashMap } from "../../util/hashMap";
import { allSimplePaths } from "graphology-simple-path";

const UP = new Vector(-1, 0);
const DOWN = new Vector(1, 0);
const LEFT = new Vector(0, -1);
const RIGHT = new Vector(0, 1);

const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

const VECTOR_MAP = new Map<string, Vector>([
    [">", RIGHT],
    ["<", LEFT],
    ["^", UP],
    ["v", DOWN]
])

function toStr(p: Point): string {
    return `[${p.x},${p.y}]`
}

export default class Day23 extends Solver {

    N: number;
    start: Point;
    end: Point;
    map: number[][];
    //0: forest
    //1: path
    //2: vector

    vectors: HashMap<Point, Vector> = new HashMap<Flatten.Point, Flatten.Vector>(p => toStr(p));

    directedGraph = new DirectedGraph();
    undirectedGraph = new UndirectedGraph();

    constructor(origInput: string) {
        super(origInput);

        const m = Parsers.asMatrix(origInput, "");
        this.map = m.map((l, row) => l.map((c, col) => {
            if (c === "#") {
                return 0;
            } else if (c === ".") {
                return 1;
            } else {
                this.vectors.set(new Point(row, col), VECTOR_MAP.get(c));
                return 2;
            }
        }))
        this.N = this.map.length;

        this.start = new Point(0, this.map[0].indexOf(1));
        this.end = new Point(this.N - 1, this.map[this.N - 1].indexOf(1));


    }

    private buildDirectedGraph() {
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                if (this.isFree(new Point(i, j))) {
                    this.directedGraph.addNode(toStr(new Point(i, j)));
                }
            }
        }

        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                const p = new Point(i, j);
                if (this.isFree(p)) {
                    let n = this.nextSteps(p);
                    if (this.map[i][j] === 2) {
                        n = [p.translate(this.vectors.get(p))];
                    }
                    for (let t of n) {
                        this.directedGraph.addEdge(toStr(p), toStr(t));
                    }
                }
            }
        }
    }

    private buildUndirectedGraph() {
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                if (this.isFree(new Point(i, j))) {
                    this.undirectedGraph.addNode(toStr(new Point(i, j)));
                }
            }
        }

        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                const p = new Point(i, j);
                if (this.isFree(p)) {
                    let n = this.nextSteps(p);
                    for (let t of n) {
                        const pp = toStr(p);
                        const tt = toStr(t);
                        if (this.undirectedGraph.edge(pp, tt) === undefined) {
                            this.undirectedGraph.addEdge(pp, tt);
                        }
                    }
                }
            }
        }
    }

    private nextSteps(p: Point): Point[] {
        return DIRECTIONS.map(d => p.translate(d)).filter(p => this.isIn(p)).filter(p => this.isFree(p));
    }

    private isFree(p: Point): boolean {
        return this.map[p.x][p.y] !== 0;
    }

    private isIn(p: Point): boolean {
        return p.x >= 0 && p.x < this.N && p.y >= 0 && p.y < this.N;
    }

    part1(): string | number {
        this.buildDirectedGraph();
        const paths = allSimplePaths(this.directedGraph, toStr(this.start), toStr(this.end));

        return Math.max(...paths.map(p => p.length)) - 1;
    }

    private getPairs(g: Graph): { start: string, end: string, seq: string[] }[] {
        const bis = g.nodes().filter(n => g.edges(n).length === 2);
        const bisVisited = new Set<string>();
        const ret: { start: string, end: string, seq: string[] }[] = [];
        for (let bi of bis) {
            if (bisVisited.has(bi)) {
                continue;
            }
            const { start, end, seq } = this.findChainOf2(g, bi);
            seq.forEach(e => bisVisited.add(e));
            ret.push({ start, end, seq })
        }
        return ret;
    }


    private findChainOf2(g: UndirectedGraph, node: string): { start: string, end: string, seq: string[] } {
        let start;
        let end;
        let seq: string[] = [];

        const visited = new Set<string>();
        visited.add(node);

        seq.push(node);

        const branches = g.edges(node).map(e => g.opposite(node, e));
        let current = branches[0];
        while (g.edges(current).length === 2) {
            // console.log(current);
            visited.add(current);
            seq.push(current);
            current = g.edges(current).map(e => g.opposite(current, e)).filter(n => !visited.has(n))[0];
        }
        start = current;
        // console.log(`start = ${current}`)
        seq.reverse();

        current = branches[1]
        while (g.edges(current).length === 2) {
            // console.log(current);
            visited.add(current);
            seq.push(current)
            current = g.edges(current).map(e => g.opposite(current, e)).filter(n => !visited.has(n))[0];
        }
        end = current;
        // console.log(`end = ${current}`)


        return { start, end, seq };
    }

    private sumWeight(g: UndirectedGraph, path: string[]) {
        let ret = 0;
        for (let i = 0; i < path.length - 1; i++) {
            ret += g.getEdgeAttribute(g.edges(path[i], path[i + 1]), "weight");
        }
        return ret;
    }


    part2(): string | number {

        const startTime = new Date().getTime();

        this.buildUndirectedGraph();

        const pairs = this.getPairs(this.undirectedGraph);
        const g = new UndirectedGraph();
        for (let pair of pairs) {
            if (!g.hasNode(pair.start)) {
                g.addNode(pair.start);
            }

            if (!g.hasNode(pair.end)) {
                g.addNode(pair.end)
            }

            g.addEdge(pair.start, pair.end, { weight: pair.seq.length + 1 });
        }


        const allPaths = allSimplePaths(g, toStr(this.start), toStr(this.end));
        const lengths = allPaths.map(p => this.sumWeight(g, p));


        const res = this.findMax(lengths);
        return res;

    }

    private findMax(ns: number[]) {
        let max = 0;
        for (let n of ns) {
            if (n > max) {
                max = n;
            }
        }
        return max;
    }
}

