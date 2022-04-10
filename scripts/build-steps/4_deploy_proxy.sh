#!/bin/bash
set -e
echo 'Deploying dex guru proxy to localhost...'
cd proxy && nohup python3 dex-guru-proxy-server.py &
echo 'Deployment done!'
