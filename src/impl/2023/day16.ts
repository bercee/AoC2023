import { Solver } from "../solver";
import { Direction, Vector2D } from "../../util/vector2D";
import ZERO = Direction.ZERO;
import UP = Direction.UP;
import UP_LEFT = Direction.UP_LEFT;
import UP_RIGHT = Direction.UP_RIGHT;
import toMatrixV = Direction.toMatrixV;
import RIGHT = Direction.RIGHT;
import DOWN = Direction.DOWN;
import LEFT = Direction.LEFT;

interface Heading {
    pos: Vector2D;
    dir: Vector2D;
}
export default class Day16 extends Solver {

    input: Vector2D[][];

    beenThere: Map<string, Set<string>> = new Map();

    width: number;
    height: number;


    constructor(origInput: string) {
        super(origInput);
        this.input = origInput.split("\n").map(l => l.split("").map(s => {
            if (s === ".") {
                return toMatrixV(ZERO);
            } else if (s === "|") {
                return toMatrixV(UP);
            } else if (s === "\\") {
                return toMatrixV(UP_LEFT);
            } else if (s === "/") {
                return toMatrixV(UP_RIGHT);
            } else if (s === "-") {
                return toMatrixV(RIGHT);
            }
        }));
        this.height = this.input.length;
        this.width = this.input[0].length;
    }

    move(h: Heading): Heading[] {
        const mirr = this.input[h.pos.x][h.pos.y];
        const nextDirs = getNextDirs(h.dir, mirr);
        return nextDirs.map(d => {return {pos: h.pos.add(d), dir: d}}).filter(h => this.isInside(h.pos));
    }


    isInside(p: Vector2D) {
        return p.x >= 0 && p.x < this.width && p.y >= 0 && p.y < this.height;
    }


    visit (h: Heading) {
        let set = this.beenThere.get(h.pos.toString());
        if (set === undefined) {
            set = new Set();
            this.beenThere.set(h.pos.toString(), set);
        }
        set.add(h.dir.toString());
    }

    haveBeenThere(h: Heading): boolean {
        return this.beenThere.get(h.pos.toString()) && this.beenThere.get(h.pos.toString()).has(h.dir.toString());
    }

    recursion(heading: Heading) {
        this.visit(heading);
        const nexts = this.move(heading).filter(h => !this.haveBeenThere(h));

        for (let h of nexts) {
            this.recursion(h);
        }
    }

    part1(): string | number {
        this.recursion({dir: toMatrixV(RIGHT), pos: Vector2D.of(0, 0)});
        return this.beenThere.size;
    }

    part2(): string | number {
        let max = 0;
        const starts: Heading[] = [];

        for (let i = 0; i < this.width; i++) {
            starts.push({dir: toMatrixV(DOWN), pos: Vector2D.of(0, i)});
            starts.push({dir: toMatrixV(UP), pos: Vector2D.of(this.height-1, i)});
        }

        for (let i = 0; i < this.height; i++) {
            starts.push({dir: toMatrixV(RIGHT), pos: Vector2D.of(i, 0)});
            starts.push({dir: toMatrixV(LEFT), pos: Vector2D.of(i, this.width-1)});
        }

        for (let s of starts) {
            this.recursion(s);
            const sum = this.beenThere.size;
            if (sum > max) {
                max = sum;
            }
            this.beenThere.clear();
        }
        return max;
    }

}

function reflect(currentDir: Vector2D, mirror: Vector2D): Vector2D {
    if (mirror.x === currentDir.x || mirror.y === currentDir.y) {
        if (mirror.x === currentDir.x) {
            return Vector2D.of(0, mirror.y);
        } else if (mirror.y === currentDir.y) {
            return Vector2D.of(mirror.x, 0);
        }
    } else {
        return reflect(currentDir, mirror.flip());
    }
    return undefined;
}

function getNextDirs(currentDir: Vector2D, mirror: Vector2D): Vector2D[] {
    if (mirror.equals(ZERO)) {
        return [currentDir];
    } else if (currentDir.equals(mirror) || currentDir.flip().equals(mirror)) {
        return [currentDir];
    } else if (currentDir.rotateClock().equals(mirror) || currentDir.rotateCounterClock().equals(mirror)) {
        return [currentDir.rotateCounterClock(), currentDir.rotateClock()];
    } else {
        return [reflect(currentDir, mirror)];
    }
}