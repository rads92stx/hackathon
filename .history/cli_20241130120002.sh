#!/bin/bash

WORKSPACE_DIR=$(dirname $(realpath $0))
CMD=$1
API_CONTAINER="hackathon-api"
export DOCKER_COMPOSE_ENV=${WORKSPACE_DIR}/docker-compose.yml
export DOCKER_COMPOSE="docker compose -f ${DOCKER_COMPOSE_ENV}"

run() {
	UUID=$(id -u) GUID=$(id -g) ${DOCKER_COMPOSE} $1 1> /dev/null
}

if [[ "$CMD" == "up" ]] || [[ "$CMD" == "start" ]]; then
	printf "\e[92m[+] Starting\e[0m\n";

	run "up -d"

	$WORKSPACE_DIR/cli.sh logs api

elif [[ $CMD == "log" ]] || [[ $CMD == "logs" ]]; then
	lines=60
	container=""
	re='^[0-9]+$'

	if [[ -z $2 ]]; then
    container="$API_CONTAINER"
	elif [[ $2 =~ $re ]]; then
		lines=$2
		container="$API_CONTAINER"
	else
		container=$2
	fi

	if [[ $3 =~ $re ]]; then
		lines=$3
	fi

	if [[ -n "$container" ]] && [[ "$container" != "$API_CONTAINER" ]]; then
		container="hackathon-$container"
	fi

	printf "\e[92mListing \e[96m$container\e[92m logs\e[0m\n";

	docker logs $container --tail=${lines} -t -f | $WORKSPACE_DIR/docker-logs-localtime

elif [[ $CMD == "console" ]] || [[ $CMD == "bash" ]] || [[ $CMD == "sh" ]]; then
	container=${2}

	if [[ -n "$container" ]]; then
		container="hackathon-$container"
	fi

	clear

	printf "\e[92m[+] Starting shell\e[0m\n";

	docker exec -it $container /bin/sh

elif [[ $CMD == "down" ]] || [[ $CMD == "stop" ]]; then
	container=${2}

	if [[ -n "$container" ]]; then
		container="hackathon-$container"
	fi

	printf "\e[92m[+] Stopping $container\e[0m\n";

	run "stop $container"
fi