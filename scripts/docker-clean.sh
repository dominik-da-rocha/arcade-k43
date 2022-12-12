#!/bin/bash

image="dominikdarocha/arcade-k43"

docker-compose down --remove-orphans
docker image rm $(docker images -q $image) --force
docker pull golang:1.19.4-bullseye
docker pull node:19-bullseye-slim
docker pull debian:bullseye-slim
