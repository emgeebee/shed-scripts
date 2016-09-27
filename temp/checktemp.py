import RPi.GPIO as GPIO
import dht11

# initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()

# read data using pin 14
instance = dht11.DHT11(pin = 4)
result = instance.read()

if result.is_valid():
    print("{\"temp\": %d, \"hum\": %d}" % (result.temperature,  result.humidity))
else:
    print("{\"temp\": \"err\", \"hum\": \"err\"}")
