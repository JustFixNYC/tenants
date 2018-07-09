#! /bin/bash

set -e

docker-compose build
docker-compose run web npm install
docker-compose run web npm run postinstall -- --allow-root
