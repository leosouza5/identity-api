import { z } from "zod";


const getRolePermissionsSchema = z.object({
  role_id: z.uuid()
})

export { getRolePermissionsSchema }