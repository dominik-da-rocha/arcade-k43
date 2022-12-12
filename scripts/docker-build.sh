#!/bin/bash

image="dominikdarocha/arcade-k43"
version="$ (cat .version)"

docker-compose up -d
docker image tag "$image" "$image:$version"
docker image ls
