#!/bin/bash

version="$(git describe --tags --dirty | sed 's/-/./g')"
image="dominikdarocha/arcade-k43"
outfile="api/ak43/version.go"
echo "// ---------------------------------------------------------------" >"$outfile"
echo "// generated file to not edit" >>"$outfile"
echo "// ---------------------------------------------------------------" >>"$outfile"
echo "package ak43" >>"$outfile"
echo "const Version = \"$version\"" >>"$outfile"
echo "" >>"$outfile"
echo $version >".version"
