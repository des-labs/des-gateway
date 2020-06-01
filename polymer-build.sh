#!/bin/bash

polymer build --base-path=${WEB_ROOT_PATH} --name=${WEB_ROOT_PATH} --preset=es5-bundled
gulp prpl-server
