#!/bin/sh

helm template -n iioat \
  --values ./values/redis-ha.yaml \
  --output-dir ./manifests \
    ./charts/redis-ha
