const getSessionID = require("./sessionId");
const cheerio = require("cheerio")

async function submit(year, day, part, solution) {
    const response =  await postContent(
        constructAnswerUrl(year, day),
        constructAnswerBody(part, solution)
    );
    const $ = cheerio.load(response);
    return $('body > main > article').text();
}


async function postContent(url, content) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept-language': 'en-US,en;q=0.9',
            'Cookie': `session=${getSessionID()}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${content}`
    });
    if (!response.ok) {
        throw new Error(`could not post ${url} \n status code: ${response.status}`)
    }
    return await response.text();
}

function constructAnswerUrl(year, day) {
    return `https://adventofcode.com/${year}/day/${day}/answer`;
}

function constructAnswerBody(part, solution) {
    return `level=${part}&answer=${solution}`
}

module.exports = {
    submit
};