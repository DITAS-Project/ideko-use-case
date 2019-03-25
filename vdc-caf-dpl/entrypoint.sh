#!/bin/sh
set -e

if [ -n "$ENVCONF" ]; then
    sleep 60
    echo "rewriting configs"
    envsubst '${vdcURI},${elasticURI},${zipkinURI}' < /.config/traffic.json > /.config/traffic.json
fi

echo "Starting the monitoring services"
cd /opt/monitoring
exec ./vdc-traffic --verbose &

echo "Moving flows file to node-red data directory"
if [ -f /data/blueprint-flows/flows.json ]; then
    cp /data/blueprint-flows/flows.json /data
    rm /data/blueprint-flows/flows.json
fi

echo "Starting Node-red"
cd /usr/src/node-red
exec su node-red -c "npm start -- --userDir /data"
#exec "$@"
echo "This container died"
