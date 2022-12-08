#!/bin/bash
echo "// ---------------------------------------------------------------" >"version.go"
echo "// generated file to not edit" >>"version.go"
echo "// ---------------------------------------------------------------" >>"version.go"
echo "package main" >>"version.go"
echo "const Version = \"$(git describe --tags --dirty)\"" >>"version.go"
echo "" >>"version.go"

go run *.go
