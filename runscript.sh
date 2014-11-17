#!/bin/bash

function main() {
 
   # create tmp directory
   base=$(pwd)
   tmp="$base/tmp"
   mkdir $tmp 
   cd $tmp

   # clone repo to local device
   echo "cloning repository: $1"
   git clone "$1"
   retcode="$?"
   if [ "$retcode" -ne 0 ]; then
      echo "error while cloning repository, exiting..."
      cleanup $tmp
      exit "$retcode"
   fi

   echo "finished cloning repository..."
   projectname=$(ls)

   # run analyzers
   cd "$base/analyzer"
   # TODO: test this:
   # python main.py --project "$tmp/$projectname" 

   cd $base 
   open -a safari ui/index.html
   cleanup $tmp
   exit 0
}

function cleanup() {
   # delete tmp directory
   echo "removing temp file: $1"
   rm -rf $tmp
}

if [ "$#" -ne 1 ]; then
   echo "usage: $0 [repository url]"
   exit 1
else
   main $1 
fi
