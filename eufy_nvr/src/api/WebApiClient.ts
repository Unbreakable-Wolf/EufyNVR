import got, { Got } from 'got';
import crypto from 'crypto';

function md5(string: string): string {
    return crypto.createHash('md5').update(string).digest('hex');
}

export class WebApiClient {
    private apiSmart = "https://security-smart.eufylife.com";

    private client: Got;
    private authToken: string;

    constructor(authToken: string) {
        this.authToken = authToken;

        this.client = got.extend({
            responseType: 'json',
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
                "Origin": "https://nvr.eufy.com",
                "Referer": "https://nvr.eufy.com/"
            }
        });
    }

    public async getNvrWsSign(stationSN: string): Promise<string | null> {
        if (!this.authToken) {
            console.error(`[WebApiClient] Missing auth token. Cannot get WS sign.`);
            return null;
        }

        // The web portal validates gtoken length; we generate a random 32-character hex string.
        const gtoken = md5(Math.random().toString());

        console.log(`[WebApiClient] Requesting WS sign for station ${stationSN}`);
        try {
            const response = await this.client.get(`${this.apiSmart}/v1/smart/nvr/ws/sign`, {
                searchParams: {
                    station_sn: stationSN
                },
                headers: {
                    "x-auth-token": this.authToken,
                    "gtoken": gtoken,
                    "Origin": "https://nvr.eufy.com",
                    "Referer": "https://nvr.eufy.com/"
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
