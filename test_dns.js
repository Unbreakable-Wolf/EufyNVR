const https = require('https');

const urls = ['nvr.eufy.com', 'nvr.eufylife.com', 'smart-nvr.eufylife.com', 'security-nvr.eufylife.com'];

urls.forEach(url => {
    https.get(`https://${url}`, (res) => {
        console.log(`${url}: ${res.statusCode} ${res.headers.location || ''}`);
    }).on('error', (e) => {
        console.log(`${url}: ERROR - ${e.message}`);
    });
});
