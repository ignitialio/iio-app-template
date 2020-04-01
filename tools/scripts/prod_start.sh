#!/bin/sh

if command -v iio 2>/dev/null; then
  iio infra dev
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

echo "app version: ${IIOS_APP_VERSION}"

export IIOS_AUTH_VERSION=1.3.1
export IIOS_DLAKE_VERSION=3.5.2

export IIOS_NAMESPACE=ignitialio
export IIOS_DBNAME=ignitialio
export IIOS_SERVER_PORT=8000
export IIOS_S3_SECURE=false
export IIOS_S3_ENDPOINT=localhost
export IIOS_S3_PORT=9000
export IIOS_S3_ACCESS_KEY_ID=G4I3RZP3I2AS7EMWQPMZ
export IIOS_S3_SECRET_ACCESS_KEY=xMzrrXMtnFEOP/K7MDFRA/bPxRfiCYEXOTOTOYEK
export IIOS_EMAILER_SMTP_PASS=toto

docker-compose -f ${PWD}/tools/docker/docker-compose.yml up -d
