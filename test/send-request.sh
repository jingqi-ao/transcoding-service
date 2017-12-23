#!/bin/bash

# Input variables
# - SERVER_ADDRESS
# - SERVER_PORT


curl -k -F 'audio=@sample.3gp' https://${SERVER_ADDRESS}:${SERVER_PORT:-8443}/api/v1/transcode -o sample.mp3
