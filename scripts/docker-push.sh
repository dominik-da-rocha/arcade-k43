#!/bin/bash

docker push "$image"
docker push "$image:$version"
if [[ "$2" == "stable" ]]; then
   docker image tag "$image" "$image:stable"
   docker push "$image:stable"
fi
