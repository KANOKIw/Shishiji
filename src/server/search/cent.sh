#!/usr/bin/env bash

firewall-cmd --add-port 80/tcp
firewall-cmd --add-port 443/tcp

sudo python ./LotSearch.py
