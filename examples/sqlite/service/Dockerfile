FROM node:alpine

COPY ./src /home/node/

WORKDIR /home/node/

RUN apk add --no-cache git && \
    npm install && \
    mkdir /db && \
    touch /db/nodes.db

CMD node index.js