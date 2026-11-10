#!/bin/bash

set -e

echo "Configuring GlassFish JDBC..."

asadmin start-domain

if ! asadmin \
    --passwordfile="${AS_ADMIN_PASSWORDFILE}" \
    --interactive=false \
    list-jdbc-connection-pools \
    | grep -q "^StudentPool$"; then

    asadmin \
        --passwordfile="${AS_ADMIN_PASSWORDFILE}" \
        --interactive=false \
        create-jdbc-connection-pool \
        --datasourceclassname org.postgresql.ds.PGSimpleDataSource \
        --restype javax.sql.DataSource \
        --property "user=${POSTGRES_USER}:password=${POSTGRES_PASSWORD}:databaseName=${POSTGRES_DB}:serverName=${POSTGRES_HOST}:portNumber=${POSTGRES_PORT}" \
        StudentPool
fi


if ! asadmin \
    --passwordfile="${AS_ADMIN_PASSWORDFILE}" \
    --interactive=false \
    list-jdbc-resources \
    | grep -q "^jdbc/StudentDS$"; then

    asadmin \
        --passwordfile="${AS_ADMIN_PASSWORDFILE}" \
        --interactive=false \
        create-jdbc-resource \
        --connectionpoolid StudentPool \
        jdbc/StudentDS
fi


asadmin \
    --passwordfile="${AS_ADMIN_PASSWORDFILE}" \
    --interactive=false \
    ping-connection-pool StudentPool


asadmin stop-domain

echo "GlassFish JDBC configuration completed."