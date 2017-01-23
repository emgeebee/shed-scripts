#!/usr/bin/env bash

temp=$(/usr/local/bin/temper-poll  | cut -d ' ' -f 3 | grep "°C" | sed -e 's/°C//g')

curl -X POST -H "Content-Type: application/json" -d '{"loft.temp":'$temp'}' http://192.168.2.158:1880/api/log-json
