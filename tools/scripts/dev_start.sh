#!/bin/sh

if command -v iio 2>/dev/null; then
  iio infra dev
  iio config app generate
  if [ $? -ne 0 ]
  then
    echo "iio version must be >=2.2.1: 'npm i -g @ignitial/iio-cli'"
    exit 1
  fi
else
  echo "iio not installed: 'npm i -g @ignitial/iio-cli'"
  exit 1
fi

export IIOS_APP_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

export IIOS_AUTH_VERSION=1.3.1
export IIOS_DLAKE_VERSION=3.5.2

echo "app version: ${IIOS_APP_VERSION}"
echo "dlake version: ${IIOS_DLAKE_VERSION}"
echo "auth version: ${IIOS_AUTH_VERSION}"

export IIOS_SERVER_ACCESS_LOGS=true
export IIOS_REST_LOGLEVEL=error
export IIOS_NAMESPACE=ignitialio
export IIOS_DBNAME=ignitialio
export IIOS_SERVER_PATH="public"
export IIOS_DROP_FILES_PATH="public/dropped"

export IIOS_S3_SECURE=false
export IIOS_S3_ENDPOINT=minio
export IIOS_S3_PORT=9000
export IIOS_S3_ACCESS_KEY_ID=G4I3RZP3I2AS7EMWQPMZ
export IIOS_S3_SECRET_ACCESS_KEY=xMzrrXMtnFEOP/K7MDFRA/bPxRfiCYEXOTOTOYEK

export IIOS_EMAILER_SMTP_PASS=toto

docker-compose -f ${PWD}/tools/docker/docker-compose-dev.yml up -d

sleep 10
#npm-run-all --parallel server:start client:serve
docker attach iioat
