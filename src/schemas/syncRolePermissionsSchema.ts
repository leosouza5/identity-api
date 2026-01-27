import { z } from "zod";


const syncRolePermissionsParamsSchema = z.object({
  role_id: z.uuid()
})

const syncRolePermissionsSchema = z.object({
  permissions_ids: z.array(z.uuid())
})

export { syncRolePermissionsSchema, syncRolePermissionsParamsSchema }