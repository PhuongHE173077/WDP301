import { env } from "~/config/environment"

export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080'
]

const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner1',
  OWNER_2: 'owner2',
  OWNER_3: 'owner3',
  TENANT: 'tenant'
}

export const WEBSITE_DOMAIN = env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export { USER_ROLES }