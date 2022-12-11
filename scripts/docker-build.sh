#!/bin/bash

docker-compose up -d
docker image tag "$image" "$image:$version"
docker image ls
