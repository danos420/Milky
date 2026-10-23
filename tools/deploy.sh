#!/bin/sh
# Build, then publish dist/ to the gh-pages branch (the live site).
set -e
cd "$(dirname "$0")/.."
python3 build.py
rm -rf /tmp/milky-ghp && cp -r dist /tmp/milky-ghp && touch /tmp/milky-ghp/.nojekyll
cd /tmp/milky-ghp && git init -q -b gh-pages && git add -A && git -c user.name="danos420" -c user.email="danos420@users.noreply.github.com" commit -q -m "Publish $(cat "$OLDPWD/src/VERSION")"
git push -f https://github.com/danos420/milky gh-pages 2>&1 | tail -1
