import z from "zod";

const deleteRoleSchema = z.object({
  role_id: z.uuid()
})

export {deleteRoleSchema}