let cnf = {
  "backEndOrigin" : "http://127.0.0.1:8888",
  "frontEndOrigin" : "http://127.0.0.1:8080",
  "rootPath"  : "",
  "apiPath"  : "",
  "ticketAuth": "",
}


let iterstr = null;
while(cnf.rootPath !== iterstr) {
  cnf.rootPath = cnf.rootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  iterstr = cnf.rootPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
}

iterstr = null;
while(cnf.apiPath !== iterstr) {
  cnf.apiPath = cnf.apiPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  iterstr = cnf.apiPath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
}

// Construct base URLs
cnf.frontEndUrl = cnf.frontEndOrigin + '/' + cnf.rootPath + '/';
cnf.backEndUrl  = cnf.backEndOrigin  + '/' + cnf.apiPath + '/';
// Ensure exactly one trailing slash
cnf.frontEndUrl = cnf.frontEndUrl.replace(/\/+$/, '/')
cnf.backEndUrl = cnf.backEndUrl.replace(/\/+$/, '/')


export const config = cnf;

// The `rbac.js` file contains the role-based access control information for
// displaying pages based on the authenticated user's roles. This file must be
// provided. In deployment it is mounted from a ConfigMap.
import { rbac_bindings } from './rbac.js'
export { rbac_bindings } from './rbac.js'
