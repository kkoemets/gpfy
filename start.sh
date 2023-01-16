#!/bin/bash


echo "              ___       "
echo "             /  _|      "
echo "   __ _ _ __\| |_ _   _ "
echo "  / _\` | '_\|  _| | | |"
echo " | (_| | |_) | | | |_| |"
echo "  \__, | .__/|_|  \__, |"
echo "   __/ | |         __/ |"
echo "  |___/|_|        |___/"

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Do you want to install it now? (y/n)"
  read -r install_docker
  if [ "$install_docker" = "y" ]; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
  else
    echo "Docker installation cancelled by user. Exiting script."
    exit 1
  fi
fi

# Check if docker-compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "docker-compose is not installed. Do you want to install it now? (y/n)"
  read -r install_docker_compose
  if [ "$install_docker_compose" = "y" ]; then
    sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  else
    echo "docker-compose installation cancelled by user. Exiting script."
    exit 1
  fi
fi

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  touch .env
fi
# Check if .env file is empty
if ! grep -q TELEGRAM_BOT_TOKEN .env; then
  echo "Provide your Telegram bot token:"
  read -r token
  # Save to .env file
  echo TELEGRAM_BOT_TOKEN="$token" >>.env
else
  echo "Bot token is already configured, do you want update it? (y/n)"
  read -r update_token
  if [ "$update_token" = "y" ]; then
    echo "Enter the new value for Telegram bot token:"
    read -r new_value
    sed -i "s/^TELEGRAM_BOT_TOKEN=.*$/TELEGRAM_BOT_TOKEN=$new_value/" .env
    echo "Telegram bot token has been updated."
  fi
fi

# Define the Docker Compose file
DOCKER_COMPOSE_FILE="docker-compose.dev.yaml"

# List of container names
container_names=(bot-database crypto-data-api telegram-client)

# Function to check if a container is running
is_container_running() {
  local container_name="$1"
  if [ "$(docker ps -q -f name="$container_name")" ]; then
    return 0
  else
    return 1
  fi
}

# Function to update a container
update_container() {
  local container_name="$1"
  if is_container_running "$container_name"; then
    echo "Stopping $container_name container..."
    docker stop "$container_name"
  fi
  echo "Building and starting $container_name container..."
  docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env up --build -d "$container_name"
  echo "Container $container_name restarted successfully 🚀"
}

if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q Up; then
  echo "The following containers are already running from $DOCKER_COMPOSE_FILE:"
  docker-compose -f "$DOCKER_COMPOSE_FILE" ps
  echo "Do you want to update a specific container? (y/n)"
  read -r update_container_prompt
  if [ "$update_container_prompt" = "y" ]; then
    PS3="Select the container to update: "
    select container_name in "${container_names[@]}"; do
      if [ -n "$container_name" ]; then
        update_container "$container_name"
        break
      else
        echo "Invalid selection. Try again."
      fi
    done
  else
    echo "Exiting script without updating any containers."
  fi
else
  echo "Starting all containers."
  docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file .env up -d
  echo "All containers started successfully 🚀"
fi
