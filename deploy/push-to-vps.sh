#!/usr/bin/env bash
# Build otakudesu images locally, upload to VPS (no remote build), update Swarm services.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../../otakudesu-be/package.json" ]]; then
  ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
else
  ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
fi
ENV_FILE="${SCRIPT_DIR}/vps.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy vps.env.example and set VPS_PASS." >&2
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_FILE"

: "${VPS_HOST:?}"
: "${VPS_USER:?}"
: "${VPS_PASS:?}"

RELEASE_TAG="${RELEASE_TAG:-$(git -C "$ROOT/otakudesu-fe" rev-parse --short HEAD)}"
BE_TAG="${BE_IMAGE_TAG:-otakudesu-be:${RELEASE_TAG}}"
FE_TAG="${FE_IMAGE_TAG:-otakudesu-fe:${RELEASE_TAG}}"
API_BUILD_URL="${API_BUILD_URL:-https://api.otakudesu.natee.my.id}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://otakudesu.natee.my.id}"
ARCHIVE="/tmp/otakudesu-images-$$.tar.gz"

ssh_cmd() {
  SSHPASS="$VPS_PASS" sshpass -e ssh -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_HOST}" "$@"
}

PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
echo "==> Building backend (${PLATFORM})..."
docker build --platform "${PLATFORM}" -t "${BE_TAG}" "${ROOT}/otakudesu-be"

echo "==> Building frontend (${PLATFORM}, API_BASE_URL=$API_BUILD_URL)..."
docker build --platform "${PLATFORM}" \
  --build-arg "API_BASE_URL=${API_BUILD_URL}" \
  --build-arg "NEXT_PUBLIC_SITE_URL=${SITE_URL}" \
  -t "${FE_TAG}" \
  "${ROOT}/otakudesu-fe"

echo "==> Saving images..."
docker save "${BE_TAG}" "${FE_TAG}" | gzip > "$ARCHIVE"

echo "==> Uploading archive ($(du -h "$ARCHIVE" | cut -f1))..."
SSHPASS="$VPS_PASS" sshpass -e scp -o StrictHostKeyChecking=accept-new "$ARCHIVE" "${VPS_USER}@${VPS_HOST}:/tmp/otakudesu-images.tar.gz"

echo "==> Updating Swarm services on VPS..."
ssh_cmd "BE_TAG='${BE_TAG}' FE_TAG='${FE_TAG}' bash -s" <<'REMOTE'
set -euo pipefail
gunzip -c /tmp/otakudesu-images.tar.gz | docker load
rm -f /tmp/otakudesu-images.tar.gz

OLD_BE="$(docker service inspect otakudesu_be --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || true)"
OLD_FE="$(docker service inspect otakudesu_fe --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || true)"

echo "Updating otakudesu_be -> ${BE_TAG}"
docker service update --image "${BE_TAG}" --detach=false otakudesu_be

echo "Updating otakudesu_fe -> ${FE_TAG}"
docker service update --image "${FE_TAG}" --detach=false otakudesu_fe

BE_STATE="$(docker service inspect otakudesu_be --format '{{.UpdateStatus.State}}' 2>/dev/null || true)"
FE_STATE="$(docker service inspect otakudesu_fe --format '{{.UpdateStatus.State}}' 2>/dev/null || true)"
[[ "$BE_STATE" == "completed" || -z "$BE_STATE" ]] || { echo "Backend update state: $BE_STATE" >&2; exit 1; }
[[ "$FE_STATE" == "completed" || -z "$FE_STATE" ]] || { echo "Frontend update state: $FE_STATE" >&2; exit 1; }

for attempt in {1..12}; do
  if curl -fsS --max-time 10 https://otakudesu.natee.my.id/ >/dev/null \
    && curl -fsS --max-time 10 https://api.otakudesu.natee.my.id/api/health >/dev/null; then
    break
  fi
  [[ "$attempt" == 12 ]] && { echo "Production health check failed" >&2; exit 1; }
  sleep 5
done

docker service ps otakudesu_be otakudesu_fe --no-trunc | head -6

for img in "$OLD_BE" "$OLD_FE"; do
  [[ -z "$img" ]] && continue
  docker image rm "$img" 2>/dev/null || true
done
echo "Services:"
docker service ls | grep otakudesu
REMOTE

rm -f "$ARCHIVE"

echo "==> Removing local images to free disk..."
docker rmi "${BE_TAG}" "${FE_TAG}" 2>/dev/null || true

echo "Done. Check https://otakudesu.natee.my.id"
