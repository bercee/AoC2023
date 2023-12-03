import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";

export default class Day1 extends Solver {


    input: string[];


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput).filter(l => l !== "");
    }

    part1(): string | number {
        let n = 0;
        this.input.forEach(l => {
            const pattern = /(\d).*(\d)/
            let match = l.match(pattern) as RegExpMatchArray;
            if (!match) {
                match = l.match(/(\d)/) as RegExpMatchArray;
            }
            console.log(l);
            console.log(match[1]);
            console.log(match[2])
            n += 10*Number.parseInt(match[1]);
            n += match[2] ? Number.parseInt(match[2]) : Number.parseInt(match[1])
        })
        return n;
    }

    part2(): string | number {
        let n = 0;
        this.input.forEach(l => {
            const pattern = /(\d|one|two|three|four|five|six|seven|eight|nine).*(\d|one|two|three|four|five|six|seven|eight|nine)/
            let match = l.match(pattern) as RegExpMatchArray;
            if (!match) {
                match = l.match(/(\d|one|two|three|four|five|six|seven|eight|nine)/) as RegExpMatchArray;
            }
            // console.log(l);
            // console.log(match[1]);
            // console.log(match[2])
            let s1 = match[1];
            let s2 = match[2] ?? match[1];
            let n1 = !Number.isNaN(parseInt(s1)) ? Number.parseInt(s1) : this.map.get(s1);
            let n2 = !Number.isNaN(parseInt(s2)) ? Number.parseInt(s2) : this.map.get(s2);
            console.log(`${l} ${s1} ${s2} ${n1} ${n2}`)
            n += 10*(n1 as number) + (n2 as number);

            // n += 10*Number.parseInt(match[1]);
            // n += match[2] ? Number.parseInt(match[2]) : Number.parseInt(match[1])
        })
        return n;
    }
    readonly map = new Map<string, number>([
        ['one',1],
        ['two',2],
        ['three',3],
        ['four',4],
        ['five',5],
        ['six',6],
        ['seven',7],
        ['eight',8],
        ['nine',9],
    ])

}