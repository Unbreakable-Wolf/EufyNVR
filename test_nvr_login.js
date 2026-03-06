const got = require('got');
const crypto = require('crypto');

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

async function test(email, password) {
    const pwdHash = md5(password);
    console.log("Testing login to nvr.eufy.com...");
    try {
        const res = await got.post('https://nvr.eufy.com/api/v1/passport/login', {
            json: { email, password: pwdHash },
            responseType: 'json',
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Origin": "https://nvr.eufy.com",
                "Referer": "https://nvr.eufy.com/"
            }
        });
        console.log("Success:", res.body);
    } catch (e) {
        if (e.response) {
            console.log("Failed:", e.response.statusCode, e.response.body);
        } else {
            console.log("Error:", e.message);
        }
    }
}

test("test@example.com", "password");
