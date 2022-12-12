#!/bin/bash

image="dominikdarocha/arcade-k43"
version="$ (cat .version)"

docker push "$image"
docker push "$image:$version"
if [[ "$1" == "stable" ]]; then
   docker image tag "$image" "$image:stable"
   docker push "$image:stable"
fi
