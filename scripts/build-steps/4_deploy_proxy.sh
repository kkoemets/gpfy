echo 'Deploying dex guru proxy to localhost...'
bash go-to-root && cd proxy && nohup python3 dex-guru-proxy-server.py &
echo 'Deployment done!'
