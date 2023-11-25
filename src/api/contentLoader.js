const fs = require("fs");
const path = require("path");
const getSessionID = require("./sessionId");

async function getTestResult(year, day, part) {
    const filePath = constructResultPath(year, day);
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    let data = '{}';
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, 'utf-8');
    }

    const dataJSON = JSON.parse(data);
    const key = `part${part}`
    if (dataJSON[key] === undefined) {
        dataJSON[key] = await extractProbableTestSolution(year, day, part);
    }
    fs.writeFileSync(filePath, JSON.stringify(dataJSON))
    return `${dataJSON[key]}`;
}

async function getInput(year, day) {
    return checkAndDownload(
        () => constructInputFilePath(year, day),
        () => downloadInput(year, day)
    )
}

async function getTestInput(year, day) {
    return checkAndDownload(
        () => constructTestInputFilePath(year, day),
        () => downloadTestInput(year, day)
    )
}

async function checkAndDownload(getFilePathFn, downloadContentFn) {
    const filePath = getFilePathFn();
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        const data = await downloadContentFn();
        fs.writeFileSync(filePath, data);
        return `${data}`;
    } else {
        return fs.readFileSync(filePath, 'utf-8');
    }
}

async function downloadTestInput(year, day) {
    const data = await loadTask(year, day);
    const pattern = /<pre><code>([\s\S]*?)<\/code><\/pre>/;
    const matches = data.match(pattern);
    const ret = matches[1];
    console.log(`Test input for year ${year} day ${day}: `)
    console.log(ret);
    return ret;
}

async function loadTask(year, day, part) {
    const rawData = await fetchContent(constructTaskUrl(year, day));
    const pattern = /<article class="day-desc">[\s\S]*?<\/article>/;
    const matches = rawData.match(pattern);
    return matches[part === undefined ? 0 : part];
}

async function extractProbableTestSolution(year, day, part) {
    const rawData = await fetchContent(constructTaskUrl(year, day));
    const pattern1 = /[Ii]n this example[\s\S]*?<em><code>([\s\S]*?)<\/code><\/em>/g;
    const pattern2 = /[Ii]n this example[\s\S]*?<code><em>([\s\S]*?)<\/em><\/code>/g;
    let matches;
    for (let i = 1; i <= part; i++) {
        matches = pattern1.exec(rawData);
    }
    if (matches !== null) {
        return matches[1];
    }
    for (let i = 1; i <= part; i++) {
        matches = pattern2.exec(rawData);
    }

    const ret = matches!== null ? matches[1] : 'could not find solution pattern.';
    console.log(`Test solution for year ${year} day ${day} part ${part}:`);
    console.log(ret);
    return ret;
}

async function downloadInput(year, day) {
    return await fetchContent(constructInputUrl(year, day));
}

function constructResultPath(year, day) {
    return  path.join(__dirname, `../../assets/inputs/year${year}/day${day}_results.txt`);
}

function constructInputFilePath(year, day) {
    return  path.join(__dirname, `../../assets/inputs/year${year}/day${day}.txt`);
}

function constructTestInputFilePath(year, day) {
    return  path.join(__dirname, `../../assets/inputs/year${year}/day${day}_test.txt`);
}

function constructInputUrl(year, day) {
    return `https://adventofcode.com/${year}/day/${day}/input`;
}

function constructTaskUrl(year, day) {
    return `https://adventofcode.com/${year}/day/${day}`;
}

async function fetchContent(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept-language': 'en-US,en;q=0.9',
            'Cookie': `session=${getSessionID()}`
        }
    });
    if (!response.ok) {
        throw new Error(`could not download content from ${url} \n status code: ${response.status}`)
    }
    return await response.text();
}

module.exports = {
    getInput,
    getTestInput,
    getTestResult
};