import { z } from "zod";

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

export { refreshTokenSchema };
