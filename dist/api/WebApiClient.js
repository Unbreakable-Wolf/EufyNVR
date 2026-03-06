"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApiClient = void 0;
const got_1 = __importDefault(require("got"));
const crypto_1 = __importDefault(require("crypto"));
function md5(string) {
    return crypto_1.default.createHash('md5').update(string).digest('hex');
}
class WebApiClient {
    email;
    passwordHash;
    apiBase = "https://mysecurity.eufylife.com/api/v1";
    apiSmart = "https://security-smart.eufylife.com";
    client;
    authToken = null;
    tokenExpiresAt = 0;
    user_id = "";
    constructor(email, passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.client = got_1.default.extend({
            responseType: 'json',
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
                "Origin": "https://mysecurity.eufylife.com",
                "Referer": "https://mysecurity.eufylife.com/"
            }
        });
    }
    async login() {
        console.log(`[WebApiClient] Attempting login for ${this.email}`);
        try {
            const response = await this.client.post(`${this.apiBase}/passport/login`, {
                json: {
                    email: this.email,
                    password: this.passwordHash
                }
            });
            const result = response.body;
            if (result.code === 0 && result.data) {
                this.authToken = result.data.auth_token;
                this.tokenExpiresAt = result.data.token_expires_at * 1000;
                this.user_id = result.data.user_id;
                console.log(`[WebApiClient] Login successful. Web token acquired.`);
                return true;
            }
            else {
                console.error(`[WebApiClient] Login failed. Code: ${result.code}, Msg: ${result.msg}`);
                return false;
            }
        }
        catch (error) {
            console.error(`[WebApiClient] Login error:`, error.message);
            if (error.response) {
                console.error(`[WebApiClient] Response:`, error.response.body);
            }
            return false;
        }
    }
    async getNvrWsSign(stationSN) {
        if (!this.authToken) {
            console.error(`[WebApiClient] Missing auth token. Cannot get WS sign.`);
            return null;
        }
        const gtoken = md5(this.user_id);
        console.log(`[WebApiClient] Requesting WS sign for station ${stationSN}`);
        try {
            const response = await this.client.get(`${this.apiSmart}/v1/smart/nvr/ws/sign`, {
                searchParams: {
                    station_sn: stationSN
                },
                headers: {
                    "x-auth-token": this.authToken,
                    "gtoken": gtoken,
                    "Origin": "https://security.eufy.com",
                    "Referer": "https://security.eufy.com/"
                }
            });
            const result = response.body;
            if (result.code === 0 && result.data) {
                console.log(`[WebApiClient] WS sign token acquired.`);
                return result.data;
            }
            else {
                console.error(`[WebApiClient] WS sign request failed. Code: ${result.code}, Msg: ${result.msg}`);
                return null;
            }
        }
        catch (error) {
            console.error(`[WebApiClient] WS sign error:`, error.message);
            if (error.response) {
                console.error(`[WebApiClient] Response:`, error.response.body);
            }
            return null;
        }
    }
}
exports.WebApiClient = WebApiClient;
