@echo off

start "" python ./src/server/search/LotSearch.py
start "" npx ts-node ./src/server/app.ts

