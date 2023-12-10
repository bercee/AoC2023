import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { DirectedGraph } from "graphology";
import { Direction, Vector2D } from "../../util/vector2D";
import _ from "lodash";
import Flatten, { line, Point, Polygon, Segment } from "@flatten-js/core";
import UP = Direction.UP;
import DOWN = Direction.DOWN;
import LEFT = Direction.LEFT;
import RIGHT = Direction.RIGHT;
import toMatrixV = Direction.toMatrixV;

const map = new Map<string, Vector2D[]>([
    ["|", [UP, DOWN].map(v => toMatrixV(v))],
    ["-", [LEFT, RIGHT].map(v => toMatrixV(v))],
    ["L", [UP, RIGHT].map(v => toMatrixV(v))],
    ["J", [UP, LEFT].map(v => toMatrixV(v))],
    ["7", [DOWN, LEFT].map(v => toMatrixV(v))],
    ["F", [DOWN, RIGHT].map(v => toMatrixV(v))]
]);

export default class Day10 extends Solver {

    input: string[][];

    graph = new DirectedGraph();
    start: Vector2D;

    loop: Vector2D[];
    vectors: Vector2D[];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput).map(s => s.split(""));
        this.parseGraph();
    }

    parseGraph() {
        for (let i = 0; i < this.input.length; i++) {
            for (let j = 0; j < this.input[i].length; j++) {
                const s = this.input[i][j];
                if (map.has(s)) {
                    this.graph.addNode(Vector2D.of(i, j).toString());
                } else if (s === "S") {
                    this.start = Vector2D.of(i, j);
                    this.graph.addNode(Vector2D.of(i, j).toString());
                }
            }
        }

        for (let i = 0; i < this.input.length; i++) {
            for (let j = 0; j < this.input[i].length; j++) {
                const s = this.input[i][j];
                if (map.has(s)) {
                    const v = Vector2D.of(i, j);
                    const tos = map.get(s);
                    for (let to of tos) {
                        if (!this.graph.hasNode(v.add(to))) {
                            continue;
                        }
                        this.graph.addEdge(v.toString(), v.add(to).toString());
                    }
                }
            }
        }


        const ins = this.graph.inEdges(this.start.toString());
        ins.forEach(i => {
            this.graph.addEdge(this.start.toString(), this.graph.opposite(this.start.toString(), i))
        })
    }

    part1(): string | number {
        const res = this.walk([this.start.toString()], [this.start.toString()], [0]);
        return res;
    }

    walk(starts: string[], visiteds: string[], steps: [number]): number {
        const nexts = starts.flatMap(s => this.targets(s)).filter(s => !visiteds.find(ss => ss === s));
        if (nexts.length) {
            visiteds.push(...nexts);
            steps[0]++;
            return this.walk(nexts, visiteds, steps);
        } else {
            return steps[0];
        }
    }

    targets(node: string): string[] {
        return this.graph.outEdges(node).map(e => this.graph.opposite(node, e)).filter(opp => this.graph.outEdges(opp).some(out => this.graph.opposite(opp, out) === node))
    }

    part2(): string | number {
        this.loop = this.getLoop();
        this.vectors = [];
        for (let i = 0; i < this.loop.length; i++) {
            this.vectors.push(this.loop[(i+1)%this.loop.length].subtract(this.loop[i]));
        }

        const max = this.input.length*this.input.length - this.loop.length;
        let n = 0;
        let count = 0;
        for (let i = 0; i < this.input.length; i++) {
            for (let j = 0; j < this.input[i].length; j++) {
                if (new Set(this.loop.map(v => v.toString())).has(Vector2D.of(i, j).toString())) {
                    continue;
                } else {
                    n++;
                    console.log(`${n/max*100}%`)
                    if (this.testPoint(new Point(i, j))) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    private testPoint(p: Point) {
        const loopPoints = this.loop.map(v => new Point(v.x+0.01, v.y+0.01));
        const polygon = new Polygon(loopPoints);
        const intersectingSegment = this.createIntersectingLine(p, loopPoints);
        const intersections = polygon.intersect(intersectingSegment);
        return intersections.length % 2 === 1;
    }



    private getLoop(): Vector2D[] {
        const ret: Vector2D[] = []
        ret.push(this.start);
        let next;
        while ((next = this.getNext(ret)) !== undefined){
            ret.push(next);
        }

        return ret;
    }


    private getNext(ret: Vector2D[]): Vector2D {
        const targets = this.targets(_.last(ret).toString()).filter(t => !ret.find(tt => tt.toString() === t));
        return targets.length ? Vector2D.parse(targets[0]) : undefined;
    }

    private createIntersectingLine(p: Flatten.Point, points: Flatten.Point[]) {
        for (let i = 0; i < points.length; i++) {
            const l = line(points[i], points[(i+1)%points.length]);
            if (!l.contains(p)) {
                const middle = new Segment(points[i], points[(i+1)%points.length]).middle();
                const vec = new Flatten.Vector(p, middle);
                return new Segment(p, p.translate(vec.multiply(1000000)));
            }
        }
    }
}
