# transcoding-service

## Why do we need transcoding service

According to page https://github.com/gillesdemey/google-speech-v2, google speech API supports following sound format:

```
16-bit PCM

The following audio options are confirmed working for 16-bit PCM sample encoding:

Channels       : 1
Sample Rate    : 16000
Precision      : 16-bit
Sample Encoding: 16-bit Signed Integer PCM

```

On Android, we can use following settings to achieve the above requirement.

```
mMediaRecorder.setAudioEncodingBitRate(16);
mMediaRecorder.setAudioSamplingRate(16000);
mMediaRecorder.setAudioChannels(1);
```

However, the default sound file is stored as .3gp format. Transcodeing server uses following command to transcode it into .wav format.
```
$ avconv -i INPUT_16K_16BIT_FILE.3gp OUTPUT_16K_16BIT_FILE.wav
```

## How to run transcoding server
Transcoding server is now running as docker container

(1) Build docker image
```
$ cd docker
# Default docker image name is: "transcoding-server". You can choose other names.
$ export DOCKER_IMAGE_FULL_NAME=transcoding-server
$ ./build-transcoding-server-image.sh
```

(2) Run docker container
```
$ docker run -d --restart=on-failure -p 8443:8443 --name transcoding-server transcoding-server
```
