#!/usr/bin/env bash

echo "===INITIALIZING SERVER CONFIGURATION==="
#Installing necessary softwares
apt update
apt upgrade

## Snapd
echo "===INSTALLING SNAPD...==="
apt install snapd
snap install core
snap refresh core
echo "===SNAPD INSTALLATION COMPLETED==="
##=====================================================================##

## Git
echo "===INSTALLING GIT...==="
apt install git-all
echo "===GIT INSTALLATION COMPLETED==="
##=====================================================================##

## Screen
echo "===INSTALLING SCRENN...==="
apt install screen
echo "===SCREEN INSTALLATION COMPLETED==="
##=====================================================================##

## Node
echo "===INSTALLING NVM==="
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
echo "===NVM INSTALLATION COMPLETED==="

echo "===INSTALLING NODEJS BY NVM==="
nvm install 'lts/*' --reinstall-packages-from=current
echo "===NODEJS INSTALLATION COMPLETED==="
##=====================================================================##

## Docker (https://docs.docker.com/engine/install/debian/)
echo "===INSTALLING DOCKER==="
apt-get install \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

echo "===DOCKER INSTALLATION COMPLETED==="

echo "===INSTALLING DOCKER-COMPOSE==="
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
echo "===DOCKER-COMPOSE INSTALLATION COMPLETED==="
##=====================================================================##

## certbot (HTTPS certificate)
apt remove certbot
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

##=====================================================================##

## App
echo "===INITIALIZING APP CONFIGURATION==="

cd ~

echo "===CLONNING REPOSITORY==="
git clone https://github.com/TheNeverChosen/remote-lab-back.git

cd remote-lab-back

echo "===CREATING .ENV AND REDIS.CONF==="
mkdir config

cd config

REDIS_PASS="bd5f0a4e37301474cf24736957ce20ef"

echo -e \
"MONGO_USER=remotelab\n\
MONGO_PASS=1234\n\
MONGO_NAME=primary\n\
REDIS_PASS=$REDIS_PASS\n\
SESSION_NAME=SID\n\
SESSION_SECRET=bbyLGkKKlRvY5GFoQda51gZyASb1n9zN\n\
SESSION_MAX_AGE=3600000\n\
APP_PORT=3333"\
>.env

echo -e \
"requirepass \"$REDIS_PASS\"\n\
save 3600 1\n\
appendonly yes\n\
appendfsync everysec"\
>redis.conf

cd ..

echo "===INSTALLING NODE MODULES==="
npm install --only=prod

echo "===DOCKER-COMPOSE BUILD==="
docker-compose build
##=====================================================================##
