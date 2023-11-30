import { Vector } from "ts-matrix";

export class Vector2D extends Vector {

    constructor(props: number[]) {
        if (props.length !== 2) {
            throw new Error("The length of a 2d vector has to be 2")
        }
        super(props);
    }


    static of(x: number, y: number): Vector2D {
        return new Vector2D([x, y]);
    }

    get x(): number {
        return this.at(0);
    }

    set x(newX: number) {
        this.values[0] = newX;
    }

    get y(): number {
        return this.at(1);
    }

    set y(newY: number) {
        this.values[1] = newY;
    }

    setValues(values: number[]): this {
        if (values.length !== 2) {
            throw new Error("length of 2d vector must be of 2")
        }
        this.x = values[0];
        this.y = values[1];
        return this;
    }

    add(vector: Vector2D): Vector2D {
         return new Vector2D(super.add(vector).values);
    }

    subtract(vector: Vector): Vector2D {
        return new Vector2D(super.subtract(vector).values);
    }
}

export namespace Direction {
    export const UP = new Vector2D([0, -1]);
    export const DOWN = new Vector2D([0, 1]);
    export const LEFT = new Vector2D([-1, 0]);
    export const RIGHT = new Vector2D([1, 0]);
    export const UP_RIGHT = new Vector2D([1, -1]);
    export const UP_LEFT = new Vector2D([-1, -1]);
    export const DOWN_RIGHT = new Vector2D([1, 1]);
    export const DOWN_LEFT = new Vector2D([-1, 1]);

    export const ZERO = new Vector2D([0, 0]);

    export const ALL = [UP, DOWN, LEFT, RIGHT, UP_RIGHT, UP_LEFT, DOWN_RIGHT, DOWN_LEFT, ZERO];

    export function findDirection(from: Vector2D, to: Vector2D): Vector2D | undefined {
        return findPerfectDir(from, to, 45);
    }

    export function findHorizontalOrVerticalDirection(from: Vector2D, to: Vector2D): Vector2D | undefined {
        return findPerfectDir(from, to, 90);
    }

    function findPerfectDir(from: Vector2D, to: Vector2D, angleStep: number): Vector2D | undefined {
        const diff = to.subtract(from);

        if (diff.equals(Vector2D.of(0,0))) {
            return ZERO;
        }

        const rem = Math.round(diff.angleFrom(Vector2D.of(0,1)) / Math.PI * 180) % angleStep;
        if (rem !== 0) {
            return undefined;
        }

        return Vector2D.of(Math.sign(diff.x), Math.sign(diff.y));
    }

}