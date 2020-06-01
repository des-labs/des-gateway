export const config = {
  "backEndUrl" : "http://127.0.0.1:8888",
  "frontEndUrl" : "http://127.0.0.1:8080",
  "rootPath"  : "",
  "apiPath"  : ""
}

// The `rbac.js` file contains the role-based access control information for
// displaying pages based on the authenticated user's roles. This file must be
// provided. In deployment it is mounted from a ConfigMap.
import { rbac_bindings } from './rbac.js'
export { rbac_bindings } from './rbac.js'
