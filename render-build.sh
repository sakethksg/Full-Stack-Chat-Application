#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend
npm install

cd ../frontend
npm install
npm run build

cd ..
chmod +x ./start.sh 