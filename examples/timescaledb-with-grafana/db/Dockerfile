FROM timescale/timescaledb:latest-pg11

ARG SERVICE_PASSWORD=98765
ENV SERVICE_PASSWORD=${SERVICE_PASSWORD}
ARG CLIENT_PASSWORD=98765
ENV CLIENT_PASSWORD=${CLIENT_PASSWORD}

RUN mkdir -p /tmp/conf

COPY ./conf /tmp/conf
COPY ./init.db.sh /docker-entrypoint-initdb.d