import { z } from "zod";


const updateRoleParamsSchema = z.object({
  role_id: z.uuid()
})

const updateRoleSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(3)
})

export { updateRoleSchema,updateRoleParamsSchema }