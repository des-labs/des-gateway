#!/bin/bash

cp package.tpl.json package.json
sed -i "s#{{SCRIPTS_BUILD}}#polymer build --base-path=${WEB_ROOT_PATH} --name=${WEB_ROOT_PATH} --preset=es5-bundled \&\& gulp prpl-server#" package.json
cp src/components/des-config.js.tpl src/components/des-config.js
sed -i "s#{{BACKEND_BASE_URL}}#${BACKEND_BASE_URL}#g" src/components/des-config.js
sed -i "s#{{API_ROOT_PATH}}#${API_ROOT_PATH}#g" src/components/des-config.js
sed -i "s#{{FRONTEND_BASE_URL}}#${FRONTEND_BASE_URL}#g" src/components/des-config.js
sed -i "s#{{WEB_ROOT_PATH}}#${WEB_ROOT_PATH}#g" src/components/des-config.js

npm install

if [[ "$NPM_SCRIPT" == "build" ]]; then
	npm run build
	npm run serve
else
	npm run start
fi
