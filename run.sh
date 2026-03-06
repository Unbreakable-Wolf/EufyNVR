#!/usr/bin/with-contenv bashio

echo "Starting Eufy NVR WebRTC Proxy Add-on..."

# Read configuration from HA options
EMAIL=$(bashio::config 'email')
PASSWORD_HASH=$(bashio::config 'password_hash')
STATION_SN=$(bashio::config 'station_sn')

export EMAIL
export PASSWORD_HASH
export STATION_SN

cd /app
node dist/index.js
