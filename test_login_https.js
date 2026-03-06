const https = require('https');
const crypto = require('crypto');

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

const data = JSON.stringify({
    email: "test@example.com",
    password: md5("test")
});

const options = {
    hostname: 'mysecurity.eufylife.com',
    port: 443,
    path: '/api/v1/passport/login',
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': 'https://mysecurity.eufylife.com',
        'Referer': 'https://mysecurity.eufylife.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    },
    // Use a restrictive cipher set typical of browsers to avoid CloudFront TLS fingerprint blocks
    ciphers: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3'
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
