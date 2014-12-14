#!/bin/bash
echo server OTF is starting ...
sudo killall mongod
sudo mongod --replSet otf_demo &
sleep 1

node --debug ./bin/www

