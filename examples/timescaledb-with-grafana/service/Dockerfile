FROM node:alpine

ARG DB_USER=service
ENV DB_USER=${DB_USER}

ARG DB_NAME=nodes
ENV DB_NAME=${DB_NAME}

ARG DB_PASSWORD=98765
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_HOST=nodes-db
ENV DB_HOST=${DB_HOST}

ARG DB_PORT=5432
ENV DB_PORT=${DB_PORT}

ARG DB_SSLMODE=disable
ENV DB_SSLMODE=${DB_SSLMODE}

COPY ./src /home/node
COPY ./wait-for-postgres.sh /usr/local/bin/

WORKDIR /home/node

RUN apk add --no-cache postgresql-client git && \
    npm install && \
    chmod +x /usr/local/bin/wait-for-postgres.sh

CMD wait-for-postgres.sh ${DB_HOST} ${DB_PORT} ${DB_USER} ${DB_PASSWORD} ${DB_NAME} && node index.js