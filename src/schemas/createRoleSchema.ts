import { z } from "zod";



const createRoleSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(3)
})

export { createRoleSchema }