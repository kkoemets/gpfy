#!/bin/bash

if [ "$1" = "dev" ]; then
    echo "Starting dev env scripts"
    if [ -n "$2" ]; then
      echo "Provided file name ´$2´"
      cd ../config || exit
      pwd
      echo "Creating config file from: " && cat "$2"
      npm run create-config-files -- --"$2"
      cd ..
      pwd

      cd proxy || exit
      pwd
      nohup python3 dex-guru-proxy-server.py &
      cd ..
      pwd

      cd server || exit
      pwd
      rm -rf node_modules
      npm install
      rm -rf build
      npm run build
      cd build/src || exit
      pwd
      nohup node app.js &
      cd ../../..
      pwd

      cd client/src || exit
      pwd
      nohup python3 run_telegram_bot.py &
#
    else
      echo "Provide env variables file name in config folder, e.g. bot.json"
    fi
elif [ "$1" = "docker" ]; then
    echo "Starting docker env scripts"
else
    echo "Provide environmental argument ´dev´ or ´docker´"
fi