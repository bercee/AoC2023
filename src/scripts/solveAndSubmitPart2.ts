import { DAY, getSolver, YEAR } from "../../configUtil";
import { submit } from "../util/solutionSubmitter"

run();
async function run() {
    const ans = (await getSolver()).part2();
    const resp = await submit(YEAR, DAY, 2, ans);
    console.log(resp);
}
