import * as fs from "fs";
import path from "path";
import { Solver } from "./src/impl/solver";
import { getTestInput, getInput } from "./src/util/contentLoader.js";

const CONFIG = "dayConfig.json";
interface Config {
    year: number,
    day: number
}
const data: Config = JSON.parse(fs.readFileSync(CONFIG, "utf-8"));

function constructImplementationPath(year: number, day: number): string {
    return path.join(__dirname, `src/impl/${year}/day${day}.ts`);
}
export const YEAR = data.year;

export const DAY = data.day;

export const PATH = constructImplementationPath(YEAR, DAY);

export async function getTestSolver(): Promise<Solver> {
    return import(PATH).then(async (module) => {
        const input = await getTestInput(YEAR, DAY);
        return new module.default(input) as Solver;
    });
}

export async function getSolver(): Promise<Solver> {
    return import(PATH).then(async (module) => {
        const input = await getInput(YEAR, DAY);
        return new module.default(input) as Solver;
    });
}

