#!/bin/bash

firewall-cmd --add-port 80/tcp
firewall-cmd --add-port 443/tcp
firewall-cmd --add-port 25565/tcp
firewall-cmd --add-port 25565/udp

(cd /root/main/Shishiji; sudo npx ts-node ./src/server/app.ts) &

APP_PID=$!

#(cd /root/main/Shishiji; sudo python3 ./src/server/search/LotSearch.py) &

LOTSEARCH_PID=$!

wait $APP_PID
wait $LOTSEARCH_PID

echo "Terminal"
