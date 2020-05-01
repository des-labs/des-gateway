export const configProd = {
    "backEndUrl" : "https://dev2.desapps.cosmology.illinois.edu",
    "frontEndUrl" : "https://dev2.desapps.cosmology.illinois.edu",
    "rootPath"  : "",
    "apiPath"  : "/easyweb/api"
}

export const configLocal = {
    "backEndUrl" : "http://localhost:8888",
    "frontEndUrl" : "",
    "rootPath"  : "/easyweb",
    "apiPath"  : ""
}

export const config = configLocal;

export const rbac_bindings = [
    {
        "role_name": "admin",
        "pages": ['page1', 'page2', 'page3', 'query-test', 'ticket']
    },
    {
        "role_name": "collaborator",
        "pages": ['page1', 'page2', 'page3', 'query-test']
    },
    {
        "role_name": "public",
        "pages": ['page1', 'page2', 'page3']
    },
]
