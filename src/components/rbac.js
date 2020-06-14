
const pages_public = []
const pages_collaborator = [...pages_public, 'db-access', 'cutout', 'status']
const pages_admin = [...pages_collaborator, 'test-job', 'ticket']

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
