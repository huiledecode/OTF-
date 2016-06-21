#!/bin/bash
#export NODE_SESSION="REDIS"
echo server OTF is starting ...
sudo killall mongod
sudo mongod --replSet otf_demo &
#sleep 1
#sudo service mongodb restart
sleep 5

node --debug ./bin/www
