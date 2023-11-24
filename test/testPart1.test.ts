import { DAY, getTestSolver, YEAR } from "../configUtil";
import { getTestResult } from "../src/util/contentLoader.js";

test('part1', async () => {
    const solver = await getTestSolver();
    const result1 = `${solver.part1()}`;
    const expected = await getTestResult(YEAR, DAY, 1);
    expect(result1).toEqual(expected);
})