const path = require("path");
const fs = require("fs");

const FILENAME = 'session_id.txt';
const REL_PATH = '../../assets';

module.exports = function getSessionID() {
    try {
        const filePath = path.join(__dirname, `${REL_PATH}/${FILENAME}`);
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading the file:', error);
    }
};
