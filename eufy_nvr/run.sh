#!/usr/bin/with-contenv bashio

echo "Starting Eufy NVR WebRTC Proxy Add-on..."

# Read configuration from HA options
EMAIL=$(bashio::config 'email')
PASSWORD=$(bashio::config 'password')
STATION_SN=$(bashio::config 'station_sn')

export EMAIL
export PASSWORD
export STATION_SN

cd /app
node dist/index.js
