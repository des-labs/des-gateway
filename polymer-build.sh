#!/bin/bash

echo "Executing polymer build with WEB_ROOT_PATH=${WEB_ROOT_PATH}..."
polymer build --base-path=${WEB_ROOT_PATH} --name=${WEB_ROOT_PATH} --preset=es5-bundled
gulp prpl-server