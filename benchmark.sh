#!/bin/bash
#set -x
# REF http://dev.petitchevalroux.net/linux/tester-son-serveur-http-linux.159.html
#store=( none memory redis mongo)
# ab -n 100 -c 100 -p post_data  -T application/x-www-form-urlencoded http://localhost:3000/signupAccount
export NODE_SESSION="REDIS"
export NODE_MODE="TEST"
store=(./bin/www )
#concurrency=( 1 10 20 30 40 50 60 70 80 90 100)
concurrency=( 1 )
total_req="10"
#url="http://127.0.0.1:3000/signupAccount"
url="http://127.0.0.1:3000/logs"
post_file_data="post_data"
path_result="."
prefix_file="otf-cluster-concurent"
#prefix_file="otf_core-single-concurent"

for c in "${concurrency[@]}"
do
	echo "Concurrency: ${c}"
	for s in "${store[@]}"
	do
		echo -n -e "${s}-${c}\t"
		node "${s}" &
		PID=$!
		sleep 10 # so the server can settle
		#ab -c ${c} -n ${total_req} -p ${post_file_data} -T application/x-www-form-urlencoded ${url} > ${path_result}/${prefix_file}-${c}.txt
		ab -c ${c} -n ${total_req} ${url} > ${path_result}/${prefix_file}-${c}.txt
		cat  ${path_result}/${prefix_file}-${c}.txt
		kill $PID
		wait $PID > /dev/null
	done
done