#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE database nodes;
    \connect nodes;

    CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

    -- Add node table
    CREATE TABLE node (
      id SERIAL CONSTRAINT node_pk PRIMARY KEY,
      name VARCHAR NOT NULL,
      url TEXT NOT NULL,
      port INTEGER NOT NULL,
      ssl BOOLEAN NOT NULL,
      cache BOOLEAN NOT NULL
    );
    CREATE INDEX ON node (name, id);

    -- Add node_data table
    CREATE TABLE node_data (
      time TIMESTAMPTZ NOT NULL,
      node_id INTEGER NOT NULL references node(id),
      alt_blocks_count BIGINT NOT NULL DEFAULT 0,
      difficulty BIGINT NOT NULL DEFAULT 0,
      gray_peerlist_size BIGINT NOT NULL DEFAULT 0,
      hashrate BIGINT NOT NULL DEFAULT 0,
      height BIGINT NOT NULL DEFAULT 0,
      incoming_connections_count BIGINT NOT NULL DEFAULT 0,
      last_known_block_index BIGINT NOT NULL DEFAULT 0,
      major_version BIGINT NOT NULL DEFAULT 0,
      minor_version BIGINT NOT NULL DEFAULT 0,
      network_height BIGINT NOT NULL DEFAULT 0,
      outgoing_connections_count BIGINT NOT NULL DEFAULT 0,
      start_time BIGINT NOT NULL DEFAULT 0,
      status VARCHAR NOT NULL DEFAULT 'Unreachable',
      supported_height BIGINT NOT NULL DEFAULT 0,
      synced BOOLEAN NOT NULL DEFAULT false,
      testnet BOOLEAN NOT NULL DEFAULT false,
      tx_count BIGINT NOT NULL DEFAULT 0,
      tx_pool_size BIGINT NOT NULL DEFAULT 0,
      version VARCHAR NOT NULL DEFAULT '0',
      white_peerlist_size BIGINT NOT NULL DEFAULT 0,
      is_cache_api BOOLEAN NOT NULL DEFAULT false,
      fee_address VARCHAR NOT NULL DEFAULT '0',
      fee_amount DECIMAL NOT NULL DEFAULT 0
    );

    ALTER TABLE node_data ADD PRIMARY KEY (node_id, time);
    CREATE INDEX ON node_data (node_id, height, difficulty, hashrate, time DESC);
    SELECT create_hypertable('node_data', 'time');

    -- Set up compression
    ALTER TABLE node_data SET (timescaledb.compress, timescaledb.compress_segmentby = 'node_id');
    SELECT add_compress_chunks_policy('node_data', INTERVAL '7 days');

    -- Read only role
    CREATE ROLE readonly;
    GRANT CONNECT ON DATABASE nodes TO readonly;
    GRANT USAGE ON SCHEMA public TO readonly;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly;

    -- Read/Write role
    CREATE ROLE readwrite;

    -- If you need to test and drop tables (e.g. setting resetDatabase = true) then use this line
    -- CREATE ROLE readwrite WITH SUPERUSER;

    GRANT CONNECT ON DATABASE nodes TO readwrite;
    GRANT USAGE, CREATE ON SCHEMA public TO readwrite;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite;
    GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO readwrite;

    -- Create users
    CREATE USER service WITH PASSWORD '$SERVICE_PASSWORD';
    CREATE USER client WITH PASSWORD '$CLIENT_PASSWORD';

    -- Grant privileges
    GRANT readonly TO client;
    GRANT readwrite TO service;
EOSQL

cp /tmp/conf/* /var/lib/postgresql/data/
