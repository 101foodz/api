#!/bin/bash

# --------------------
# GET SOURCES
# --------------------
# NOTE: 'SETTINGS_URI' Passed via deploy file
SETTINGS_DATA=$(curl -s $SETTINGS_URI)
API_URI=$(echo $SETTINGS_DATA | jq -r '.api')       && echo "API_URI=$API_URI" > .env
GUN_PUB=$(echo $SETTINGS_DATA | jq -r '.pub')       && echo "GUN_PUB=$GUN_PUB" >> .env
GUN_ROOT=$(echo $SETTINGS_DATA | jq -r '.root')     && echo "GUN_ROOT=$GUN_ROOT" >> .env
GUN_PEERS=$(echo $SETTINGS_DATA | jq -r '.peers')   && echo "GUN_PEERS=$GUN_PEERS" >> .env

# --------------------
# RUN
# --------------------
sudo mongod </dev/null &>/dev/null &
node server.js </dev/null &>/dev/null &