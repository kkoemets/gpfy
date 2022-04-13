#!/bin/bash
set -e
cd ../..
root=$PWD

cd "$root"/proxy && bash start.sh

cd "$root"/server && bash start.sh
