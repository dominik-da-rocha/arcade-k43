#!/bin/bash
version="$(git describe --tags --dirty | sed 's/-/./g')"
echo "// ---------------------------------------------------------------" >"version.go"
echo "// generated file to not edit" >>"version.go"
echo "// ---------------------------------------------------------------" >>"version.go"
echo "package main" >>"version.go"
echo "const Version = \"$version\"" >>"version.go"
echo "" >>"version.go"

sed -i "s/AK43_VERSION=.*/AK43_VERSION=$version/g" .env

if [[ "$1" == "run" ]]; then
   go run main.go version.go
else
   echo "unknown command $1"
fi
