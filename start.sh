#!/bin/bash
version="$(git describe --tags --dirty | sed 's/-/./g')"
image="dominikdarocha/arcarde-k43"
echo "// ---------------------------------------------------------------" >"version.go"
echo "// generated file to not edit" >>"version.go"
echo "// ---------------------------------------------------------------" >>"version.go"
echo "package main" >>"version.go"
echo "const Version = \"$version\"" >>"version.go"
echo "" >>"version.go"

if [[ "$1" == "run" ]]; then
   go run main.go version.go
elif [[ "$1" == "docker" ]]; then
   docker-compose down
   docker image rm $(docker images -q $image)
   docker-compose up -d
   docker image tag "$image" "$image:$version"
   docker image ls
   docker push "$image"
   docker push "$image:$version"
else
   echo "unknown command $1"
fi
