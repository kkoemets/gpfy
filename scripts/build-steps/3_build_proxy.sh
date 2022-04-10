#!/bin/bash
set -e
echo 'Building proxy...'
cd proxy && pip3 install -r requirements.txt
echo 'Proxy built!'
