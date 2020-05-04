export const configLocal = {
    "backEndUrl" : "http://localhost:8888",
    "frontEndUrl" : "",
    "rootPath"  : "/easyweb",
    "apiPath"  : ""
}

export const config = configLocal;

// The `rbac.js` file contains the role-based access control information for
// displaying pages based on the authenticated user's roles. This file must be
// provided. In deployment it is mounted from a ConfigMap.
import { rbac_bindings } from './rbac.js'
export { rbac_bindings } from './rbac.js'
