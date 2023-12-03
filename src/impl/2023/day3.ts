import { Solver } from "../solver";
import { Direction, Vector2D } from "../../util/vector2D";
import { HashSet } from "../../util/hashSet";
import _ from "lodash";
import { HashMap } from "../../util/hashMap";

export default class Day3 extends Solver {

    input: string[][];
    rows: number;
    cols: number;

    numbers: Vector2D[][] = [];


    constructor(origInput: string) {
        super(origInput);
        this.input = origInput.split("\n").map(l => l.split(""));
        this.rows = this.input.length;
        this.cols = this.input[0].length;
        this.parse();
        // const m = origInput.match(/\d+/g);
        // console.log(m.length)
    }

    part1(): string | number {
        // console.log(`${this.numbers.length}`);
        const filtered = this.numbers.filter(n => this.hasSymbol(this.getAdjacents(n)));
        // console.log(`${filtered.length}`)
        const res = _.sum(_.map(filtered, n => this.getNum(n)));
        return res;
    }

    private parse(){
        let curr: Vector2D[] = [];
        for (let row = 0; row < this.rows; row++) {
            if (curr.length) {
                this.numbers.push(curr);
                curr = [];
            }
            for (let col = 0; col < this.cols; col++) {
                if (this.input[row][col].match(/\d/)) {
                    curr.push(Vector2D.of(row, col));
                } else {
                    if (curr.length) {
                        this.numbers.push(curr);
                        curr = [];
                    }
                }
            }
        }
    }

    private getNum(v: Vector2D[]) {
        return _.parseInt(v.map(p => this.input[p.x][p.y]).join(""));
    }

    private getAdjacents(num: Vector2D[]) {
        const neighbours = new HashSet<Vector2D>();
        num.forEach(p => {
            Direction.ALL.forEach(d => neighbours.add(p.add(d)));
        })
        num.forEach(n => neighbours.delete(n));
        return [...neighbours.toArray()]
            .filter(p => p.x >= 0 && p.y >= 0 && p.x < this.rows && p.y < this.cols)
    }

    private hasSymbol(vs: Vector2D[]): boolean {
        return _.some(vs, v => this.input[v.x][v.y] !== '.')
    }



    part2(): string | number {
        const map = new HashMap<Vector2D, number[]>();
        this.numbers.forEach(n => {
            const stars = this.getAdjacents(n).filter(v => this.input[v.x][v.y] === "*");
            stars.forEach(s => {
                const arr = map.get(s);
                if (arr === undefined) {
                    map.set(s, [this.getNum(n)]);
                } else {
                    arr.push(this.getNum(n))
                }
            })
        })
        let res = 0;
        map.getKeys().forEach(s => {
            const arr: number[] = map.get(s);
            if (arr.length  === 2) {
                res += arr[0] * arr[1];
            }
        })
        return res;
    }

}