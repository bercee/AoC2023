import { DAY, getSolver, YEAR } from "../../configUtil";
import { submit } from "../api/solutionSubmitter"

run();
async function run() {
    const ans = (await getSolver()).part1();
    const resp = await submit(YEAR, DAY, 1, ans);
    console.log(resp);
}
