
const pages_public = []
const pages_collaborator = [...pages_public, 'page3', 'db-access', 'cutout']
const pages_admin = [...pages_collaborator, 'ticket']

export const rbac_bindings = [
		{
			"role_name": "public",
			"pages": pages_public
		},
		{
			"role_name": "collaborator",
			"pages": pages_collaborator
		},
		{
			"role_name": "admin",
			"pages": pages_admin
		},
]
