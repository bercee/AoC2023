import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { Direction, Vector2D } from "../../util/vector2D";
import DOWN = Direction.DOWN;
import UP = Direction.UP;
import RIGHT = Direction.RIGHT;
import LEFT = Direction.LEFT;
import { HashMap } from "../../util/hashMap";
import ZERO = Direction.ZERO;
import findDirection = Direction.findDirection;
import findHorizontalOrVerticalDirection = Direction.findHorizontalOrVerticalDirection;

interface Segment {
    p1: Vector2D;
    p2: Vector2D;
}


export default class Day5 extends Solver {

    input: Segment[] = [];


    constructor(origInput: string) {
        super(origInput);
        const lines = Parsers.asArray(origInput);
        const pattern = /(\d+),(\d+) .* (\d+),(\d+)/;
        lines.forEach(l => {
            const match = l.match(pattern);
            if (match === null) {
                console.log(l);
                throw new Error("sorry");
            }
            this.input.push({
                p1: new Vector2D([Number.parseInt(match[1]), Number.parseInt(match[2])]),
                p2: new Vector2D([Number.parseInt(match[3]), Number.parseInt(match[4])])
            })
        })
    }


    part1(): string | number {
        const visits: HashMap<Vector2D, number> = new HashMap<Vector2D, number>();


        for (const element of this.input) {
            let p1 = element.p1;
            let p2 = element.p2;
            const dir = findHorizontalOrVerticalDirection(p1, p2);

            if (!dir) {
                continue;
            }


            this.visit(p1, visits);
            while (!p1.equals(p2)) {
                p1 = p1.add(dir);

                this.visit(p1, visits);
            }
        }
        return visits.getKeys().filter(p => visits.get(p) as number >= 2).length;
    }

    private visit (v: Vector2D, vs: HashMap<Vector2D, number>) {
        if (v.equals(new Vector2D([0,9]))) {
            let i = 0;
        }
        const n = vs.get(v);
        if (n !== undefined) {
            vs.set(v, n + 1);
        } else {
            vs.set(v, 1);
        }
    }

    part2(): string | number {
        const visits: HashMap<Vector2D, number> = new HashMap<Vector2D, number>();


        for (const element of this.input) {
            let p1 = element.p1;
            let p2 = element.p2;
            const dir = findDirection(p1, p2);

            if (!dir) {
                continue;
            }


            this.visit(p1, visits);
            while (!p1.equals(p2)) {
                p1 = p1.add(dir);

                this.visit(p1, visits);
            }
        }
        return visits.getKeys().filter(p => visits.get(p) as number >= 2).length;
    }
}

