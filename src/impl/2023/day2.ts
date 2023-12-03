import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";

interface Set {
    red: number,
    blue: number,
    green: number
}
interface Game {
    id: number,
    sets: Set[]
}

export default class Day2 extends Solver {


    input: string[]
    games: Game[] = [];

    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput).filter(s => s !== "");
        this.parse();
    }

    private parse() {
        this.input.forEach(l => {
            const gameAndRest = l.split(":");
            const numStr = gameAndRest[0].split(" ");
            const num = Number.parseInt(numStr[1]);
            const setsStr = gameAndRest[1].split(";");
            let sets: Set[] = [];
            setsStr.forEach(s => {
                const cubes = s.trim().split(", ");
                let red = 0;
                let green = 0;
                let blue = 0;
                cubes.forEach(c => {
                    const cubeCount = c.split(" ");
                    let num = Number.parseInt(cubeCount[0]);
                    if (cubeCount[1] === "red") {
                        red = num;
                    } else if (cubeCount[1] === "blue") {
                        blue = num;
                    } else if (cubeCount[1] === "green") {
                        green = num;
                    }
                })
                sets.push({red, green, blue});
            })
            this.games.push({id: num, sets});
        })
        console.log(this.games)
    }

    part1(): string | number {
        const redMax = 12;
        const greenMax = 13;
        const blueMax = 14;
        let ret = 0;
        const filtered = this.games.filter(g => {
            return g.sets.every(s => {
                return s.blue <= blueMax && s.green <= greenMax && s.red <= redMax;
            });
        });
        filtered.forEach(g => ret += g.id);
        return ret;
    }

    part2(): string | number {
        let ret = 0;
        this.games.forEach(g => {
            let minRed = 0
            let minBlue = 0
            let minGreen = 0
            g.sets.forEach(s => {
                if (s.red > minRed) {
                    minRed = s.red;
                }
                if (s.green > minGreen) {
                    minGreen = s.green;
                }
                if (s.blue > minBlue) {
                    minBlue = s.blue;
                }
            })
            ret += minBlue*minGreen*minRed;
        })
        return ret;
    }

}