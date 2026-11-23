#!/bin/sh
# Runs the browser tests in the Playwright container: the environment CI uses, and the only
# one in which the screenshots are compared. Arguments go to "playwright test".
#
#   sh scripts/browser-tests-in-docker.sh                              compare
#   sh scripts/browser-tests-in-docker.sh --update-snapshots=changed visual    take the screenshots again
#
# The container gets a copy of the repository and installs its own dependencies, because the
# ones on the host are built for the host. It builds the package and the playgrounds, and serves
# them on its own ports. The screenshots and the results of the run are copied back.
set -eu

root=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
version=$(node -p "require('$root/node_modules/@playwright/test/package.json').version")
image="mcr.microsoft.com/playwright:v$version-noble"
shots="$root/tests/browser/__screenshots__"
results="$root/test-results"
mkdir -p "$shots" "$results"

docker run --rm --ipc=host \
  -v "$root":/repo:ro \
  -v "$shots":/shots \
  -v "$results":/results \
  "$image" sh -euc '
    mkdir /work
    cd /repo
    tar -cf - \
      --exclude=node_modules --exclude=./.git --exclude=dist --exclude=.nuxt --exclude=.output \
      --exclude=./test-results --exclude=./playwright-report . | tar -xf - -C /work
    cd /work
    npm install --global --silent "$(node -p "require(\"./package.json\").packageManager")"
    pnpm install --frozen-lockfile
    pnpm build
    status=0
    CI=1 pnpm test:browser:run "$@" || status=$?
    cp -R tests/browser/__screenshots__/. /shots/ 2>/dev/null || true
    rm -rf /results/* && cp -R test-results/. /results/ 2>/dev/null || true
    exit $status
  ' sh "$@"
