import { z } from "zod";
import { createPostSchema, updatePostSchema } from "~/app/_schemas/posts.schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          ...input,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      return await ctx.db.post.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data,
      });
    }),

    getEditPost: protectedProcedure
      .input(z.object({ id: z.number().min(1) }))
      .query(async ({ ctx, input: { id } }) => {
      return await ctx.db.post.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });
  }),

    getPost: publicProcedure
      .input(z.object({ id: z.number().min(1) }))
      .query(async ({ ctx, input: { id } }) => {
      return await ctx.db.post.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
        },
        where: {
          OR: [
            {
              id,
              isPublic: true,
            },
            {
              id,
              userId: ctx.session?.user.id,
            },
          ]
        },
      });
  }),

  getPosts: publicProcedure
    .input(z.object({
      strona: z.number().min(1).optional().default(1),
      take: z.number().min(1).optional().default(10),
    }))
    .query(async ({ ctx, input: { take, strona } }) => {
      return await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          OR: [
            {
              isPublic: true,
            },
            {
              userId: ctx.session?.user.id,
            },
          ],
        },
        take,
        skip: take * (strona - 1),
      });
    }),
});
