#!/bin/bash
echo server OTF is starting ...
export NODE_SESSION="REDIS"
sudo killall mongod
sudo mongod --replSet otf_demo &
sleep 5

node --debug ./bin/www
