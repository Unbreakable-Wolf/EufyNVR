import { WebApiClient } from "./api/WebApiClient";

async function main() {
    const email = process.env.EMAIL;
    const authToken = process.env.AUTH_TOKEN;
    const stationSn = process.env.STATION_SN;

    if (!authToken || !stationSn) {
        console.error("Missing required environment variables: AUTH_TOKEN, STATION_SN");
        process.exit(1);
    }

    console.log(`Starting Eufy NVR WebRTC Proxy for station: ${stationSn}`);

    const client = new WebApiClient(authToken);
    const signToken = await client.getNvrWsSign(stationSn);

    if (signToken) {
        console.log("Successfully obtained NVR WebSocket Sign Token! We are ready for Phase 3.");
    } else {
        console.error("Failed to obtain NVR WebSocket Sign Token. Your Web Token may be expired or invalid.");
    }
}

main().catch(err => {
    console.error("Unhandled error in main:", err);
});
