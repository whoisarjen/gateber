import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const followerRouter = createTRPCRouter({
  getIsFollowing: protectedProcedure
    .input(z.object({
      userId: z.string().min(1),
    }))
    .query(async ({ ctx, input: { userId } }) => {
        return await ctx.db.follower.findFirst({
            where: {
                userId,
                authorId: ctx.session.user.id,
            },
        });
    })
})
