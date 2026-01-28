import { z } from "zod";


const syncUserRolesParamsSchema = z.object({
  user_id: z.uuid()
})

const syncUserRolesSchema = z.object({
  roles_ids: z.array(z.uuid())
})

export { syncUserRolesSchema, syncUserRolesParamsSchema }