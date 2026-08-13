#!/bin/bash
# YORISOU LOCAL APP — owned stop, then owned start. No duplicated lifecycle logic.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$DIR/stop.sh" || exit 1
exec "$DIR/start.sh"
