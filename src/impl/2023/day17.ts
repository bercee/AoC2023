import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Direction, Vector2D } from "../../util/vector2D";
import { DirectedGraph } from "graphology";
import { dijkstra } from "graphology-shortest-path";
import toMatrixV = Direction.toMatrixV;
import RIGHT = Direction.RIGHT;
import UP = Direction.UP;
import DOWN = Direction.DOWN;
import LEFT = Direction.LEFT;
import MAIN = Direction.MAIN;

interface Status {
    pos: Vector2D;
    dir: Vector2D;
}

interface TargetWithWeight {
    status: Status;
    weight: number;
}

export default class Day17 extends Solver {

    input: number[][];

    width: number;
    height: number;

    end: Vector2D;

    graph = new DirectedGraph();


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asIntMatrix(origInput, "");
        this.width = this.input[0].length;
        this.height = this.input.length;
        this.end = Vector2D.of(this.height - 1, this.width - 1);

    }

    private addAllNodes() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.graph.addNode(toStr({ pos: (Vector2D.of(i, j)), dir: toMatrixV(UP) }));
                this.graph.addNode(toStr({ pos: (Vector2D.of(i, j)), dir: toMatrixV(DOWN) }));
                this.graph.addNode(toStr({ pos: (Vector2D.of(i, j)), dir: toMatrixV(LEFT) }));
                this.graph.addNode(toStr({ pos: (Vector2D.of(i, j)), dir: toMatrixV(RIGHT) }));
            }
        }
    }

    private addAllEdges(min: number, max: number) {
        for (let i = 0; i < this.height; i++) {
            let start: Status;
            for (let j = 0; j < this.width; j++) {
                for (let dir of MAIN) {
                    start = { pos: (Vector2D.of(i, j)), dir };
                    this.addEdge(start, this.findTargets(start, min, max));
                }
            }
        }
    }

    private addEdge(start: Status, ws: TargetWithWeight[]) {
        for (let w of ws) {
            this.graph.addEdge(toStr(start), toStr(w.status), { weight: w.weight });
        }
    }


    private isIn(i: number, j: number) {
        return i >= 0 && i < this.height && j >= 0 && j < this.width;
    }

    private isInV(v: Vector2D): boolean {
        return this.isIn(v.x, v.y);
    }

    private findTargets(s: Status, min: number, max: number): TargetWithWeight[] {
        const ret: TargetWithWeight[] = [];

        let w: number = 0;

        for (let i = 1; i <= max; i++) {
            const newPos = s.pos.add(s.dir.mul(i));
            if (!this.isInV(newPos)) {
                break;
            }
            w += this.input[newPos.x][newPos.y];
            if (i < min) {
                continue;
            }
            ret.push({ status: { pos: newPos, dir: s.dir.rotateClock() }, weight: w });
            ret.push({ status: { pos: newPos, dir: s.dir.rotateCounterClock() }, weight: w });
        }
        return ret;
    }

    private findBestPath(): string[] {
        const starts = [
            {
                dir: toMatrixV(RIGHT), pos: Vector2D.of(0, 0)
            },
            {
                dir: toMatrixV(DOWN), pos: Vector2D.of(0, 0)
            }]
        const endDirs = [DOWN, RIGHT];

        let paths = [];
        for (let start of starts) {
            for (let endDir of endDirs) {
                paths.push(dijkstra.bidirectional(this.graph, toStr(start), toStr({ pos: this.end, dir: endDir })));
            }
        }
        paths.sort((a, b) => this.countWeight(a) - this.countWeight(b));
        return paths[0];
    }

    private countWeight(path: string[]) {
        let res = 0;
        for (let i = 0; i < path.length - 1; i++) {
            res += this.graph.getEdgeAttributes(this.graph.edge(path[i], path[i + 1]))["weight"]
        }

        return res;
    }

    part1(): string | number {

        this.addAllNodes();
        this.addAllEdges(1, 3);
        console.log(`nodes: ${this.graph.nodes().length}`)
        console.log(`edges: ${this.graph.edges().length}`)

        return this.countWeight(this.findBestPath());
    }

    part2(): string | number {

        this.addAllNodes();
        this.addAllEdges(4, 10);
        console.log(`nodes: ${this.graph.nodes().length}`)
        console.log(`edges: ${this.graph.edges().length}`)

        return this.countWeight(this.findBestPath());
    }

    printPath(path: string[]) {
        let out = this.input.map(l => l.map(s => ` `))
        console.log(path);
        for (let s of path) {
            const p = /[\-]?\d+/g;
            const m = s.match(p);
            const d = Vector2D.of(Number.parseInt(m[2]), Number.parseInt(m[3]));
            let arr = ".";
            if (d.equals(Vector2D.of(-1, 0))) {
                arr = "^";
            } else if (d.equals(Vector2D.of(1, 0))) {
                arr = "v";
            } else if (d.equals(Vector2D.of(0, -1))) {
                arr = "<";
            } else if (d.equals(Vector2D.of(0, 1))) {
                arr = ">";
            }
            out[Number.parseInt(m[0])][Number.parseInt(m[1])] = arr;

        }
        console.log(out.map(l => l.join("")).join("\n"));
    }

}

function toStr(s: Status) {
    return `{${s.pos}, ${s.dir}}`
}
