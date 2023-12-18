import { Solver } from "../solver";
import { CellDirection, DOWN, LEFT, RIGHT, UP } from "../../util/cellDirections";
import { Parsers } from "../../util/inputParser";
import { Point, Polygon, Vector } from "@flatten-js/core";
import _ from "lodash";

interface Step {
    dir: CellDirection;
    l: number;
}

interface Points {
    points: Point[];
    topLeft: Point;
    botRight: Point;
}

const DIRECTIONS = new Map([
    ["U", UP],
    ["D", DOWN],
    ["L", LEFT],
    ["R", RIGHT],
])


const DIRECTIONS2 = new Map([
    ["0", RIGHT],
    ["1", DOWN],
    ["2", LEFT],
    ["3", UP],
])

export default class Day18 extends Solver {

    input: string[];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
    }

    private parseBasic(): Step[] {
        const steps: Step[] = [];
        const pattern = /(.) (\d+) \((.*)\)/;
        for (let line of this.input) {
            const m = line.match(pattern);
            steps.push({ dir: DIRECTIONS.get(m[1]), l: Number.parseInt(m[2]) });
        }

        return steps;
    }

    private parseAdvanced(): Step[] {
        const steps: Step[] = [];
        const pattern = /(.) (\d+) \((.*)\)/;
        for (let line of this.input) {
            const m = line.match(pattern);
            steps.push({ dir: DIRECTIONS2.get(m[3].charAt(6)), l: Number.parseInt(m[3].substring(1, 6), 16) });
        }

        return steps;
    }

    toPoints(steps: Step[]): Points {
        let points: Point[] = []
        points.push(new Point(0, 0));
        for (let step of steps) {
            points.push(_.last(points).translate(step.dir.multiply(step.l)));
        }
        points.pop();

        const topLeft = new Point(_.min(points.map(p => p.x)), _.min(points.map(p => p.y)));
        const botRight = new Point(_.max(points.map(p => p.x)), _.max(points.map(p => p.y)));

        return { points, topLeft, botRight }
    }

    private perimeter(poly: Polygon): number {
        return [...poly.faces][0].perimeter;
    }

    private solveFor(steps: Step[]): number {
        const points = this.toPoints(steps);
        const polygon = new Polygon(points.points);
        //Pick's theorem https://en.wikipedia.org/wiki/Pick%27s_theorem
        return polygon.area() + this.perimeter(polygon)/2 + 1;
    }

    part1(): string | number {
        return this.solveFor(this.parseBasic());
    }

    part2(): string | number {
        return this.solveFor(this.parseAdvanced());
    }

}