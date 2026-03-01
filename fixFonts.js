const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replace font weights
            content = content.replace(/font-bold/g, 'font-medium');
            content = content.replace(/font-black/g, 'font-semibold');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated fonts in ${fullPath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log("Done updating fonts.");
