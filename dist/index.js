"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebApiClient_1 = require("./api/WebApiClient");
async function main() {
    const email = process.env.EMAIL;
    const passwordHash = process.env.PASSWORD_HASH;
    const stationSn = process.env.STATION_SN;
    if (!email || !passwordHash || !stationSn) {
        console.error("Missing required environment variables: EMAIL, PASSWORD_HASH, STATION_SN");
        process.exit(1);
    }
    console.log(`Starting Eufy NVR WebRTC Proxy for station: ${stationSn}`);
    const client = new WebApiClient_1.WebApiClient(email, passwordHash);
    const loggedIn = await client.login();
    if (loggedIn) {
        const signToken = await client.getNvrWsSign(stationSn);
        if (signToken) {
            console.log("Successfully obtained NVR WebSocket Sign Token! We are ready for Phase 3.");
        }
        else {
            console.error("Failed to obtain NVR WebSocket Sign Token.");
        }
    }
    else {
        console.error("Login failed. Check credentials.");
    }
}
main().catch(err => {
    console.error("Unhandled error in main:", err);
});
