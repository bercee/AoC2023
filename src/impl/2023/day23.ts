import { Solver } from "../solver";
import { Point, Vector } from "@flatten-js/core";
import { Parsers } from "../../util/inputParser";
import { DirectedGraph } from "graphology";
import { HashMap } from "../../util/hashMap";
import { allSimplePaths } from "graphology-simple-path";
import MatrixExt from "../../util/matrixExt";
import { HashSet } from "../../util/hashSet";
import { dijkstra } from "graphology-shortest-path";
import { distance } from "mathjs";

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

    graph = new DirectedGraph();



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
        this.end = new Point(this.N-1, this.map[this.N-1].indexOf(1));





    }

    private buildGraph(part1 = true) {
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                if (this.isFree(new Point(i, j))) {
                    this.graph.addNode(toStr(new Point(i, j)));
                }
            }
        }

        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                const p = new Point(i, j);
                if (this.isFree(p)) {
                    let n = this.nextSteps(p);
                    if (part1 && this.map[i][j] === 2) {
                        n = [p.translate(this.vectors.get(p))];
                    }
                    for (let t of n) {
                        this.graph.addEdge(toStr(p), toStr(t));
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
        this.buildGraph();
        const paths = allSimplePaths(this.graph, toStr(this.start), toStr(this.end));

        return Math.max(...paths.map(p => p.length))-1;
    }

    private getV(m: number[][], p: Point) {
        return m[p.x][p.y];
    }

    private setV(m: number[][], p: Point, v: number) {
        m[p.x][p.y] = v;
    }

    part2(): string | number {
        this.buildGraph(false);

        const start = toStr(this.start);
        const end = toStr(this.end);
        let shortest = dijkstra.bidirectional(this.graph, start, end);

        let found = true;
        let step = 0;
        while (found) {
            found = false;
            shortest = dijkstra.bidirectional(this.graph, start, end);
            console.log(`iteration ${++step}, status: ${shortest.length-1}`);
            // for (let i = 0; i < shortest.length-1; i++) {
            for (let i = shortest.length - 2 ; i >= 0; i--) {
                const edge = this.graph.edge(shortest[i], shortest[i+1]);
                this.graph.dropEdge(edge);
                let newShortest = dijkstra.bidirectional(this.graph, start, end);
                if (newShortest !== null) {
                    found = true;
                    shortest = dijkstra.bidirectional(this.graph, start, end);
                    console.log(`         status: ${shortest.length}`);
                    // break;
                } else {
                    this.graph.addEdge(shortest[i], shortest[i+1]);
                }


            }
        }

        // const paths = this.findAllPathsIterative(this.start, this.end);
        // return paths.length;
        return shortest.length-1;
    }

    private findAllPaths(source: Point, target: Point, path: Point[] = [], visited: HashSet<Point> = new HashSet<Flatten.Point>()): Point[][] {
        console.log(toStr(source));
        path = [...path, source];
        visited.add(source);

        if (source === target) {
            return [path];
        }

        let paths: Point[][] = [];
        for (const neighbor of this.nextSteps(source)) {
            if (!visited.has(neighbor)) {
                const newHashSet = new HashSet<Point>();
                newHashSet.addAll(...visited.toArray())
                const newPaths = this.findAllPaths(neighbor, target, path, newHashSet);
                paths = paths.concat(newPaths);
            }
        }

        return paths;
    }

    private findAllPathsIterative(source: Point, target: Point): Point[][] {
        const stack: { node: Point, path: Point[] }[] = [];
        const paths: Point[][] = [];
        const visited: Set<Point> = new Set();

        stack.push({ node: source, path: [] });

        while (stack.length > 0) {
            const { node, path } = stack.pop()!;
            visited.add(node);
            const currentPath = [...path, node];

            if (node === target) {
                paths.push(currentPath);
            } else {
                const neighbors = this.nextSteps(node);
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        stack.push({ node: neighbor, path: currentPath });
                    }
                }
            }
        }

        return paths;
    }

}
