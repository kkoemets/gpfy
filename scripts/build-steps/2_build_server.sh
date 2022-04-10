echo 'Building server...'
bash go-to-root && cd server && npm install && npm run build && cd ..
echo 'Server built!'
