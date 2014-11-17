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
   python main.py --project "$tmp/$projectname" 

   cd $base 
   launchui
   cleanup $tmp
   exit 0
}

function launchui() {
   if [[ "$OSTYPE" == "linux"* ]]; then
      firefox ui/index.html
   elif [[ "$OSTYPE" == "darwin"* ]]; then
      open -a safari ui/index.html
   else
      echo "unsupported OS detected: please run on linux or mac, exiting..."
      exit 1
   fi
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

