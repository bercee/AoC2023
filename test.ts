import { getInput, getTestInput, getTestResult } from "./src/util/contentLoader.js";

console.log("helo")


getInput(2021, 22).then(console.log)
getTestInput(2021, 1).then(console.log)
getTestResult(2022,5,1).then(console.log)