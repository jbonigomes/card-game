#!/usr/bin/env sh

cd dist
git init
git checkout -b main
git add -A
git commit -m 'deploy'
git push -f git@github.com:jbonigomes/card-game.git main:gh-pages
cd -
