#!/bin/sh

export IIOS_POPULATE_ALL=true
export IIOS_NAMESPACE=iioat
export IIOS_DBNAME=iioat
export IIOS_MONGODB_URI=example-cluster-on-mongo-atlas.gcp.mongodb.net
export IIOS_MONGODB_USER=ignitial
export IIOS_MONGODB_OPTIONS="retryWrites=true&w=majority"
# don't forget to add your server to Mongo Atlas white list
# export IIOS_MONGODB_PASSWORD=<your_password>

./tools/js/populate_db-mongo.js
