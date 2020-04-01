#!/bin/sh

RED='\033[0;31m'
ORANGE='\033[0;33m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Generate configuration
# ------------------------------------------------------------------------------
iio config data generate

# ------------------------------------------------------------------------------
# Redis
# ------------------------------------------------------------------------------
kubectl --kubeconfig ${IIOS_K8S_KUBECONFIG_PATH} apply -f k8s/deploy/ &
sleep 5
echo "${ORANGE}waiting for completion (10min timeout)...${NC}"

# wait for job to be completed
kubectl wait --for=condition=complete --timeout=600s job/iioat-populate

echo "${ORANGE}save logs to [tools/logs/populate-atlas.log]...${NC}"

# save and show logs
kubectl logs job/iioat-populate > tools/logs/k8s-populate.log
kubectl logs job/iioat-populate

# delete populate job
kubectl delete -f k8s/deploy
