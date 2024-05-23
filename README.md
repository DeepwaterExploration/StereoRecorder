# RecordingBox

## Orange Pi 5 Pro Setup

- User would be: `/home/ubuntu/`

1. Install NVME drive on RockPi 5 Pro
2. Flash image to SD Card: https://joshua-riek.github.io/ubuntu-rockchip-download/
    - I used `ubuntu-22.04-preinstalled-server-arm64-orangepi-5-pro.img.xz`, since I am only using this via SSH
3. Install SD card into RockPi 5 Pro
4. Run this command to copy the OS onto the NVME drive: https://github.com/Joshua-Riek/ubuntu-rockchip/wiki/Ubuntu-22.04-LTS#install-ubuntu-onto-an-nvme-from-linux
5. After it is complete, shutdown RockPi 5 Pro
6. Remove SD card
7. Attach to a PC and use a disk partition management tool
8. Delete only the partition that contains "-rootfs". Do not delete any other partition.
    - Example: "desktop-rootfs"
    - In my case, that partition was also the largest partition.
9. Eject SD card, and install into RockPi 5 Pro.
10. It will now boot into the OS on the NVME drive

## Additions to bashrc

```
alias restart_recording_app='sudo systemctl daemon-reload && sudo systemctl restart recording_app.service'

alias restart_webserver='sudo systemctl daemon-reload && sudo systemctl restart flask_app.service'
```

## Hostname MNDS Setup

### set hostname to `orangepi.local`

```
sudo apt update
sudo apt install avahi-daemon avahi-utils

sudo systemctl enable avahi-daemon
sudo systemctl start avahi-daemon

hostnamectl set-hostname orangepi

sudo systemctl restart avahi-daemon
```

### check status:

```
sudo systemctl status avahi-daemon
```