FROM node:6.9.2

EXPOSE 8443

WORKDIR /transcoding-server

COPY ./certs/ /transcoding-server/certs/
COPY ./modules/ /transcoding-server/modules

COPY ./package.json /transcoding-server/
COPY ./server.js /transcoding-server/

RUN apt-get update && \
    apt-get install -y libav-tools

RUN npm install

CMD ["node","server.js"]