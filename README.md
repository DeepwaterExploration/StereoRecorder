# Stereo Recording Software

software developed for testing purposes and data collection


## Pre-requisites

### Gstreamer/V4l2

```bash
sudo apt install -y libx264-dev libjpeg-dev \
libglib2.0-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev \
gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
gstreamer1.0-plugins-bad gstreamer1.0-libav libgstreamer-plugins-bad1.0-dev \
gstreamer1.0-plugins-ugly gstreamer1.0-gl \
v4l-utils
```

### NodeJS/NPM

[Install NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Install LTS version of NodeJS/NPM
```bash
nvm install --lts
```

Install global NPM Packages
```bash
npm -g install http-serve
```

### Python Backend

Install Python
```bash
sudo apt update
sudo apt upgrade
sudo apt install python3 python3-pip
```

Install Python Packages
```bash
cd backend/
pip install -r requirements.txt
```

## Development

### Running Backend

```bash
cd backend/
./startServer.sh # production mode
```

or

```bash
cd backend/
python server.py # dev mode
```

### Running Frontend

Install Dependencies
```bash
cd frontend/
npm i
npm run dev # dev mode
```


## Building

### Building Frontend
```bash
cd frontend/
npm run build
```

### Create Services for Booting on Startup

#### Backend service

Change `INSERT_USER` to the user where the repo is cloned. Change overall repo directory as well.

```bash
[Unit]
Description=StereoRecorder Backend Server
After=network.target

[Service]
User=INSERT_USER
Group=www-data
WorkingDirectory=/home/INSERT_USER/Github/StereoRecorder/backend
ExecStart=/home/INSERT_USER/.local/bin/waitress-serve --host=0.0.0.0 --port=8669 server:app

[Install]
WantedBy=multi-user.target
```


#### Frontend hosting service

Change `INSERT_USER` to the user where the repo is cloned. Change overall repo directory as well.

```bash
[Unit]
Description=HTTP server to serve the StereoRecorder frontend
After=network.target

[Service]
User=INSERT_USER
Group=www-data
WorkingDirectory=/home/INSERT_USER/Github/StereoRecorder/frontend
Environment=PATH=/home/INSERT_USER/.nvm/versions/node/v20.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/home/latte/.nvm/versions/node/v20.16.0/bin/http-server -p 3000 -a 0.0.0.0 dist

[Install]
WantedBy=multi-user.target
```
