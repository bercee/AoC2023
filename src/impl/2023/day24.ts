import { Solver } from "../solver";
import { Point, Segment, Vector } from "@flatten-js/core";
import { Parsers } from "../../util/inputParser";
import { Point3d, Vector3d } from "open3d";
import { init } from "z3-solver";


export default class Day24 extends Solver {

    private segments: Segment[] = [];

    private areaMin: number;
    private areaMax: number;

    private points3d: Point3d[] = [];
    private vectors3d: Vector3d[] = [];

    input: string[]


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
        this.findMinMax(this.input.length);
    }

    findMinMax(n: number) {

        if (n <= 5) {
            this.areaMin = 7;
            this.areaMax = 27;
        } else {
            this.areaMin = 200000000000000;
            this.areaMax = 400000000000000;
        }
    }

    private parsePart1() {
        for (let line of this.input) {
            const dat = line.split(/[\s,@]+/).map(s => Number.parseInt(s));
            const p = new Point(dat[0], dat[1]);
            let v = new Vector(dat[3], dat[4]);
            const vL = v.length;
            const m = (this.areaMax - this.areaMin) / vL * 10;
            v = v.multiply(m);
            this.segments.push(new Segment(p, p.translate(v)));
        }
    }

    private getIntersections(): Point[] {
        const ret: Point[] = [];
        for (let i = 0; i < this.segments.length; i++) {
            for (let j = i + 1; j < this.segments.length; j++) {
                const inters = this.segments[i].intersect(this.segments[j]);
                if (inters.length !== 0) {
                    ret.push(inters[0]);
                }
            }
        }

        return ret;
    }

    private isWithinArea(p: Point) {
        return p.x >= this.areaMin && p.x <= this.areaMax && p.y >= this.areaMin && p.y <= this.areaMax;
    }


    part1(): string | number {
        this.parsePart1();
        const intersections = this.getIntersections();


        return intersections.filter(p => this.isWithinArea(p)).length;
    }

    private parsePart2() {
        for (let line of this.input) {
            const dat = line.split(/[\s,@]+/).map(s => Number.parseInt(s));
            this.points3d.push(new Point3d(dat[0], dat[1], dat[2]));
            this.vectors3d.push(new Vector3d(dat[3], dat[4], dat[5]));
        }
    }

    private async solvePart2(n0: number, n1: number, n2: number) {

        //credit to https://gist.github.com/p-a/a1e41157e0e02ee27116ab9e71388d69
        // i did some stealing here... :(
        const { init } = require('z3-solver');


        const { Context, em } = await init();

        const Z3 = Context('main');

        const a = Z3.Real.const('a');
        const b = Z3.Real.const('b');
        const c = Z3.Real.const('c');
        const t = Z3.Real.const('t');
        const u = Z3.Real.const('u');
        const v = Z3.Real.const('v');
        const d = Z3.Real.const('d');
        const e = Z3.Real.const('e');
        const f = Z3.Real.const('f');

        const p0 = this.points3d[n0];
        const v0 = this.vectors3d[n0];

        const p1 = this.points3d[n1];
        const v1 = this.vectors3d[n1];

        const p2 = this.points3d[n2];
        const v2 = this.vectors3d[n2];


        const [A0x, A0y, A0z] = [p0.X, p0.Y, p0.Z];
        const [V0x, V0y, V0z] = [v0.X, v0.Y, v0.Z];

        const [A1x, A1y, A1z] = [p1.X, p1.Y, p1.Z];
        const [V1x, V1y, V1z] = [v1.X, v1.Y, v1.Z];


        const [A2x, A2y, A2z] = [p2.X, p2.Y, p2.Z];
        const [V2x, V2y, V2z] = [v2.X, v2.Y, v2.Z];


        const solver = new Z3.Solver();

        solver.add(a.add(t.mul(d)).eq(t.mul(V0x).add(A0x)))
        solver.add(b.add(t.mul(e)).eq(t.mul(V0y).add(A0y)))
        solver.add(c.add(t.mul(f)).eq(t.mul(V0z).add(A0z)))
        solver.add(a.add(u.mul(d)).eq(u.mul(V1x).add(A1x)))
        solver.add(b.add(u.mul(e)).eq(u.mul(V1y).add(A1y)))
        solver.add(c.add(u.mul(f)).eq(u.mul(V1z).add(A1z)))
        solver.add(a.add(v.mul(d)).eq(v.mul(V2x).add(A2x)))
        solver.add(b.add(v.mul(e)).eq(v.mul(V2y).add(A2y)))
        solver.add(c.add(v.mul(f)).eq(v.mul(V2z).add(A2z)))
        await solver.check();
        em.PThread.terminateAllThreads();
        const consts = [a, b, c];
        let ret = 0;
        for (let c of consts) {
            const r = Number(solver.model().eval(c))
            ret += r;
        }
        return ret;
    }


    private addEq(n: number, solver: any) {
        const p = this.points3d[n];
        const v = this.vectors3d[n];

        const [x0, y0, z0] = [p.X, p.Y, p.Z];
        const [a0, b0, c0] = [v.X, v.Y, v.Z];

        solver.add(
            (((this.x.sub(x0)).mul(this.c.mul(b0).sub(this.b.mul(c0)))).add(
                (this.y.sub(y0)).mul(this.a.mul(c0).sub(this.c.mul(a0)))
            ).add(
                (this.z.sub(z0)).mul(this.b.mul(a0).sub(this.a.mul(b0)))
            )).eq(0)
        )


    }

    x: any;
    y: any;
    z: any;
    a: any;
    b: any;
    c: any;

    private async otherSolution() {
        const { init } = require('z3-solver');


        const { Context, em } = await init();

        const Z3 = Context('main');
        const solver = new Z3.Solver();


        this.x = Z3.Real.const('x');
        this.y = Z3.Real.const('y');
        this.z = Z3.Real.const('z');
        this.a = Z3.Real.const('a');
        this.b = Z3.Real.const('b');
        this.c = Z3.Real.const('c');

        this.addEq(0, solver);
        this.addEq(1, solver);
        this.addEq(2, solver);

        await solver.check();
        em.PThread.terminateAllThreads();
        const consts = [this.x, this.y, this.z];

        let ret = 0;
        for (let c of consts) {
            const r = Number(solver.model().eval(c))
            ret += r;
        }
        return ret;



    }

    part2(): string | number {
        this.parsePart2();
        this.solvePart2(0, 1, 2).then(n => console.log("This is a correct solution, even though it's stolen:", n));
        this.otherSolution().then(n => console.log("This was supposed to me my solution, but it does not work :( ",n));
        return undefined;
    }

}