#!/bin/sh

LIST=(CHANGELOG.md package.json README.md LICENSE)

#clean output
clean() {
   if [ -d dist ]; then
     rm -rf dist/*
   fi
}

#build project
build() {
   npm run build
   #for file in ${LIST[@]}
   #do
     #if [ -f $file ]; then
       #cp $file ./output
     #fi
   #done
}

run() {
  clean
  build
}

run