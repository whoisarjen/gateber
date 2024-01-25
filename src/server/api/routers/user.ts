import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({
      id: z.string().min(1),
    }))
    .query(async ({ ctx, input: { id } }) => {
        return await ctx.db.user.findFirstOrThrow({
            where: {
                id,
            },
        });
    })
})
