#!/usr/bin/with-contenv bashio

echo "Starting Eufy NVR WebRTC Proxy Add-on..."

# Read configuration from HA options
AUTH_TOKEN=$(bashio::config 'auth_token')
STATION_SN=$(bashio::config 'station_sn')

export AUTH_TOKEN
export STATION_SN

cd /app
node dist/index.js
