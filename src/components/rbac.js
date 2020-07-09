
const pages_default = ['db-access', 'cutout', 'status']
const pages_collaborator = [...pages_default]
const pages_admin = [...pages_collaborator, 'test-job', 'ticket', 'users']

export const rbac_bindings = [
		{
			"role_name": "default",
			"pages": pages_default
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
