#!/bin/bash
#export NODE_SESSION="REDIS"
echo server OTF is starting ...
sudo killall mongod
#sudo killall redis-server
sudo mongod --replSet otf_demo &
#sudo redis-server &
#sleep 1
#sudo service mongodb restart
sleep 5

node ./bin/www

