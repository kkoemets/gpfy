# gpfy

Crypto-related Telegram bot

Live version: https://telegram.me/gpfy_bot

### 1. Prerequisites

#### 1.1. List of prerequisites to run the applications

##### 1.1.1. In Docker

1. Docker: `https://docs.docker.com/get-docker/`
2. Docker Compose: `https://docs.docker.com/compose/install/`

##### 1.1.2. Locally

1. Node.js: `https://nodejs.org/en/download/`
2. Python 3: `https://www.python.org/downloads/`

### 2. Getting started on development environment

#### 2.1. Installation

1. Clone the repository: `git clone gfpy`
2. Install dependencies: `npm install` in `crypto-data` and `crypto-data-api` directory to. Pack crypto-data module and
   use it to install dependencies for `crypto-data-api module`. For further questions please refer
   to `docker-compose.dev.yaml` file.
3. Install Python dependencies: `pip install -r requirements.txt` in `telegram-client` directory. To run the client you
   need to have environment variables set up, see `configuration.py`. For further questions please refer
   to `docker-compose.dev.yaml` file.
4. Start mongoDB: `docker-compose -f docker-compose.dev.yaml up -d bot-database`. For further questions please refer
   to `docker-compose.dev.yaml` file.

### 3. Running in Docker

* Run in terminal from project root `docker-compose -f docker-compose.dev.yaml up` to run all services.
* To run only one service
  run `docker-compose -f docker-compose.dev.yaml up <service_name>`.
* To run in detached mode add `-d` flag.

License MIT © 2021-2023 Kristjan Koemets.
