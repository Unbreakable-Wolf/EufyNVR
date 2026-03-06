const fs = require('fs');

const indexJs = fs.readFileSync('index.js', 'utf8');
const vendorJs = process.argv.includes('vendor') ? fs.readFileSync('vendor.js', 'utf8') : '';

const combined = indexJs + vendorJs;

// Extract anything that looks like an API endpoint (e.g. /v1/..., /api/...)
const pathRegex = /(?:"|')(?:\/(?:api|v[1-9])\/[^"']+|[^"']+\/login[^"']*)(?:"|')/g;
let matches = combined.match(pathRegex);

if (matches) {
    // Unique matches
    matches = [...new Set(matches)];
    matches.forEach(m => console.log(m));
} else {
    console.log("No API paths found.");
}
