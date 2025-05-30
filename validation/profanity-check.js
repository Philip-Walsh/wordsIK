const fs = require('fs');
const path = require('path');
const Filter = require('bad-words');
const filter = new Filter();

// Add custom words to the filter if needed
filter.addWords('customword1', 'customword2');

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(content);

        // Check all string fields in the JSON
        const checkObject = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    if (filter.isProfane(obj[key])) {
                        throw new Error(`Profanity found in ${filePath} at ${key}: "${obj[key]}"`);
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    checkObject(obj[key]);
                }
            }
        };

        checkObject(jsonData);
        return true;
    } catch (error) {
        if (error.message.includes('Profanity found')) {
            console.error('\x1b[31m%s\x1b[0m', error.message); // Red color for errors
            process.exit(1);
        }
        throw error;
    }
}

// Get the file path from command line arguments
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
}

checkFile(filePath); 