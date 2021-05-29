import json
import urllib

from flask import Flask

from configuration import dex_guru_proxy_host, dex_guru_proxy_port

app = Flask(__name__)

dex_guru_host = 'https://api.dex.guru/'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    full_path = dex_guru_host + path;
    print('Requesting-' + full_path)
    responseJson = json.loads(urllib.request.urlopen(
        urllib.request.Request(dex_guru_host + path, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf8'))
    return responseJson


if __name__ == '__main__':
    app.run(host=dex_guru_proxy_host.replace('http://', ''), port=dex_guru_proxy_port)