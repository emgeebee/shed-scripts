#!/bin/sh

echo "Running" > /tmp/foo
#echo "motion detected"
#curl -X POST https://maker.ifttt.com/trigger/shed_motion/with/key/cvmP8dgKX0gAWexL6Vtem0
curl -X GET http://localhost:1880/api/detect-motion
