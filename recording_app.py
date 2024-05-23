import wiringpi
import time
import subprocess
import os
import signal
import datetime
import json
import logging

from wiringpi import GPIO

# Setup WiringPi
wiringpi.wiringPiSetup()

# Setup logging
logging.basicConfig(filename='/home/ubuntu/recording_script.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Pin definitions
LED_PIN = 6
BUTTON_PIN = 20
DELAY = 0.5

# Set pin modes
wiringpi.pinMode(LED_PIN, GPIO.OUTPUT)
wiringpi.pinMode(BUTTON_PIN, GPIO.INPUT)

# Ensure LED is initially off
wiringpi.digitalWrite(LED_PIN, GPIO.LOW)

# Function to blink the LED
def blink_led(pin=LED_PIN, delay=DELAY):
    wiringpi.digitalWrite(pin, GPIO.HIGH)
    time.sleep(delay)
    wiringpi.digitalWrite(pin, GPIO.LOW)
    time.sleep(delay)

# Define the output directory explicitly
output_directory = '/home/ubuntu/Videos'
os.makedirs(output_directory, exist_ok=True)

# Function to start recording
def start_recording(cam_config):
    if not cam_config['enabled']:
        return None
    
    # Construct the full path for the output file
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_directory, f'output_cam{cam_config["dev"]}_{timestamp}.avi')
    command = (
        f'gst-launch-1.0 -e v4l2src device=/dev/video{cam_config["dev"]} ! '
        f'image/jpeg,width={cam_config["frameWidth"]},framerate={cam_config["framerate"]}/1 ! '
        f'queue ! avimux ! filesink location={output_file} -e'
    )
    logging.debug(f"Executing command: {command}")
    return subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Function to stop recording
def stop_recording(process):
    if process and process.poll() is None:
        process.send_signal(signal.SIGINT)
        try:
            process.communicate(timeout=10)  # Wait for the process to end cleanly
        except subprocess.TimeoutExpired:
            process.kill()
            process.communicate()

# Main loop
recording_processes = {}

try:
    while True:
        button_state = wiringpi.digitalRead(BUTTON_PIN)
        if button_state == GPIO.HIGH:
            logging.debug("Button pressed, starting recording")
            # Reload camera configuration from JSON file
            try:
                with open('camera_config.json', 'r') as file:
                    config = json.load(file)
            except Exception as e:
                logging.error(f"Failed to read camera_config.json: {e}")
                continue

            for cam, cam_config in config.items():
                if cam_config['enabled'] and cam not in recording_processes:
                    recording_processes[cam] = start_recording(cam_config)
                    logging.debug(f"Started recording for camera {cam}")
            blink_led()
        else:
            if recording_processes:
                logging.debug("Button released, stopping recording")
                logging.debug(list(recording_processes.keys()))
                for cam in list(recording_processes.keys()):
                    stop_recording(recording_processes[cam])
                    del recording_processes[cam]
                    logging.debug(f"Stopped recording for camera {cam}")
                wiringpi.digitalWrite(LED_PIN, GPIO.LOW)  # Ensure LED is off
        time.sleep(DELAY/2)  # Small delay to debounce button

except KeyboardInterrupt:
    logging.info("KeyboardInterrupt received, stopping all recordings")
finally:
    for cam in recording_processes:
        stop_recording(recording_processes[cam])
    wiringpi.digitalWrite(LED_PIN, GPIO.LOW)  # Ensure LED is off
    logging.info("Script ended, all recordings stopped")
