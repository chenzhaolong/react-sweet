#!/bin/sh

LIST=(CHANGELOG.md package.json README.md LICENSE)

#clean output
clean() {
   if [ -d output ]; then
     rm -rf output/*
   fi
}

#build project
build() {
   npm run build
   for file in ${LIST[@]}
   do
     if [ -f $file ]; then
       cp $file ./output
     fi
   done
}

run() {
  clean
  build
}

run