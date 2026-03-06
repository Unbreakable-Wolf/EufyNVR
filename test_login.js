const crypto = require('crypto');
const got = require('got');

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

async function test(email, password) {
    const pwdHash = md5(password);
    console.log("Testing got...");
    try {
        const res = await got.post('https://mysecurity.eufylife.com/api/v1/passport/login', {
            json: { email, password: pwdHash },
            responseType: 'json',
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Origin": "https://mysecurity.eufylife.com",
                "Referer": "https://mysecurity.eufylife.com/",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Sec-Ch-Ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"Windows\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            }
        });
        console.log("Got Success:", res.body);
    } catch (e) {
        if (e.response) {
            console.log("Got Failed:", e.response.statusCode, e.response.body);
        } else {
            console.log("Got Error:", e.message);
        }
    }

    console.log("\nTesting native fetch...");
    try {
        const res = await fetch('https://mysecurity.eufylife.com/api/v1/passport/login', {
            method: 'POST',
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Origin": "https://mysecurity.eufylife.com",
                "Referer": "https://mysecurity.eufylife.com/",
                "Accept-Language": "en-US,en;q=0.9",
            },
            body: JSON.stringify({ email, password: pwdHash })
        });
        const text = await res.text();
        console.log("Fetch Status:", res.status, text);
    } catch (e) {
        console.log("Fetch Error: ", e);
    }
}

test("test@example.com", "password");
