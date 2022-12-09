#!/bin/bash
version="$(git describe --tags --dirty | sed 's/-/./g')"
image="dominikdarocha/arcade-k43"
echo "// ---------------------------------------------------------------" >"version.go"
echo "// generated file to not edit" >>"version.go"
echo "// ---------------------------------------------------------------" >>"version.go"
echo "package main" >>"version.go"
echo "const Version = \"$version\"" >>"version.go"
echo "" >>"version.go"

if [[ "$1" == "run" ]]; then
   go run main.go version.go
elif [[ "$1" == "docker" ]]; then
   docker-compose down --remove-orphans
   docker image rm $(docker images -q $image) --force
   docker-compose up -d
   docker image tag "$image" "$image:$version"
   docker push "$image"
   docker push "$image:$version"
   if [[ "$2" == "stable" ]]; then
      docker image tag "$image" "$image:stable"
      docker push "$image:stable"
   fi
   docker image ls
else
   echo "unknown command $1"
fi
