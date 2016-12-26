#!/bin/bash

if [ -z "$DOCKER_IMAGE_FULL_NAME" ];
then
	DOCKER_IMAGE_FULL_NAME=transcoding-server
	echo "DOCKER_IMAGE_FULL_NAME is NOT set. Use default name: "$DOCKER_IMAGE_FULL_NAME
fi

rm -rf ./build/
mkdir -p ./build/

cp -r ../certs ./build/
cp -r ../modules ./build/
cp ../server.js ./build/
cp ../package.json ./build/

cp ./Dockerfile ./build/

cd build
docker build -t $DOCKER_IMAGE_FULL_NAME --file ./Dockerfile .
cd ..

#rm -rf ./build