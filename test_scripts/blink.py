import wiringpi
import time

from wiringpi import GPIO

# Setup WiringPi
wiringpi.wiringPiSetup()

# Set pin mode to output
wiringpi.pinMode(6, GPIO.OUTPUT)

# Function to blink the LED
def blink_led(duration):
    end_time = time.time() + duration
    while time.time() < end_time:
        wiringpi.digitalWrite(6, GPIO.HIGH)  # Turn LED on
        time.sleep(0.5)                      # Wait for 0.5 seconds
        wiringpi.digitalWrite(6, GPIO.LOW)   # Turn LED off
        time.sleep(0.5)                      # Wait for 0.5 seconds

# Blink the LED for 5 seconds
blink_led(5)

# Ensure LED is turned off at the end
wiringpi.digitalWrite(6, GPIO.LOW)

