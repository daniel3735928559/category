#!/bin/bash
pip install -r requirements.txt
pushd page
npm install
pushd src/components/search
./make.sh
popd
./build.sh
popd