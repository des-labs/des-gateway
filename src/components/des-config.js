export const configProd = {
  "backEndUrl" : "{{BACKEND_BASE_URL}}",
  "frontEndUrl" : "{{FRONTEND_BASE_URL}}",
  "rootPath"  : "{{WEB_ROOT_PATH}}",
  "apiPath"  : "{{API_ROOT_PATH}}"
}

export const config = configProd;

// The `rbac.js` file contains the role-based access control information for
// displaying pages based on the authenticated user's roles. This file must be
// provided. In deployment it is mounted from a ConfigMap.
import { rbac_bindings } from './rbac.js'
export { rbac_bindings } from './rbac.js'
