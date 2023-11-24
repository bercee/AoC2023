import { DAY, getTestSolver, YEAR } from "../configUtil";
import { getTestResult } from "../src/util/contentLoader.js";

test('part2', async () => {
    const solver = await getTestSolver();
    const result = `${solver.part2()}`;
    const expected = await getTestResult(YEAR, DAY, 2);
    expect(result).toEqual(expected);
})