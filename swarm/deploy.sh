#!/bin/sh

export IIOS_DLAKE_VERSION=3.5.2
export IIOS_AUTH_VERSION=1.3.1

docker network create --opt encrypted -d overlay infra
docker stack deploy -c swarm/docker-compose.yml iioat
