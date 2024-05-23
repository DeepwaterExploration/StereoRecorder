import wiringpi
import time

from wiringpi import GPIO

# Setup WiringPi
wiringpi.wiringPiSetup()

# Pin definitions
BUTTON_PIN = 20

# Set pin mode to input
wiringpi.pinMode(BUTTON_PIN, GPIO.INPUT)

try:
    while True:
        button_state = wiringpi.digitalRead(BUTTON_PIN)
        if button_state == GPIO.HIGH:
            print("Button is pressed")
        else:
            print("Button is not pressed")
        time.sleep(0.1)  # Small delay to debounce button

except KeyboardInterrupt:
    pass

finally:
    print("Exiting script")
