const getTestSolver = require("../../configUtil").getTestSolver;
const getTestResult = require("../api/contentLoader").getTestResult;

async function test(year, day, part) {
    console.log('---------------- TEST ----------------')
    console.log(`year ${year} day ${day} part ${part}`);
    const solver = await getTestSolver();
    const expected = await getTestResult(year, day, part);
    const answer = part === 1 ? solver.part1() : solver.part2();
    if (expected === `${answer}`) {
        console.log(`OK. Result = ${answer}`)
    } else {
        console.log(`FAILED.`);
        console.log(`Expected: ${expected}`);
        console.log(`Actual:   ${answer}`)
    }
}

module.exports = {
    test
}