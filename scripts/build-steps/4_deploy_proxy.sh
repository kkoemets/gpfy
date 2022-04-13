#!/bin/bash
set -e
echo 'Deploying dex guru proxy to localhost...'
cd proxy && bash start.sh
echo 'Deployment done!'
