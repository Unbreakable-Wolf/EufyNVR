import got, { Got } from 'got';
import crypto from 'crypto';

function md5(string: string): string {
    return crypto.createHash('md5').update(string).digest('hex');
}

export class WebApiClient {
    private email: string;
    private passwordHash: string;
    private apiBase = "https://mysecurity.eufylife.com/api/v1";
    private apiSmart = "https://security-smart.eufylife.com";

    private client: Got;
    private authToken: string | null = null;
    private tokenExpiresAt: number = 0;
    private user_id: string = "";

    constructor(email: string, passwordHash: string) {
        this.email = email;
        this.passwordHash = passwordHash;

        this.client = got.extend({
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

    public async login(): Promise<boolean> {
        console.log(`[WebApiClient] Attempting login for ${this.email}`);
        try {
            const response = await this.client.post(`${this.apiBase}/passport/login`, {
                json: {
                    email: this.email,
                    password: this.passwordHash
                }
            });

            const result = response.body as any;
            if (result.code === 0 && result.data) {
                this.authToken = result.data.auth_token;
                this.tokenExpiresAt = result.data.token_expires_at * 1000;
                this.user_id = result.data.user_id;
                console.log(`[WebApiClient] Login successful. Web token acquired.`);
                return true;
            } else {
                console.error(`[WebApiClient] Login failed. Code: ${result.code}, Msg: ${result.msg}`);
                return false;
            }
        } catch (error: any) {
            console.error(`[WebApiClient] Login error:`, error.message);
            if (error.response) {
                console.error(`[WebApiClient] Response:`, error.response.body);
            }
            return false;
        }
    }

    public async getNvrWsSign(stationSN: string): Promise<string | null> {
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

            const result = response.body as any;
            if (result.code === 0 && result.data) {
                console.log(`[WebApiClient] WS sign token acquired.`);
                return result.data as string;
            } else {
                console.error(`[WebApiClient] WS sign request failed. Code: ${result.code}, Msg: ${result.msg}`);
                return null;
            }
        } catch (error: any) {
            console.error(`[WebApiClient] WS sign error:`, error.message);
            if (error.response) {
                console.error(`[WebApiClient] Response:`, error.response.body);
            }
            return null;
        }
    }
}
