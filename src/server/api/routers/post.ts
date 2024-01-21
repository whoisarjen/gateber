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
    .input(z.object({
      id: z.number().min(1),
      isPublic: z.boolean().optional().default(true),
    }))
    .query(async ({ ctx, input: { id, isPublic } }) => {
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
            isPublic,
          },
          {
            id,
            userId: ctx.session?.user.id,
          },
        ]
      },
    });
  }),

  getPostsByUserId: publicProcedure
    .input(z.object({
      userId: z.string(),
      isPublic: z.boolean().optional().default(true),
      page: z.number().min(1).optional().default(1),
      take: z.number().min(1).max(10).optional().default(10),
    }))
    .query(async ({ ctx, input: { take, page, userId, isPublic } }) => {
      const where = {
        isPublic,
        userId,
      }

      const [posts, total] = await ctx.db.$transaction([
        ctx.db.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            },
          },
          take,
          skip: take * (page - 1),
        }),
        ctx.db.post.count({ where }),
      ])

      return {
        posts,
        page,
        take,
        pageCount: Math.ceil(total / take),
        total,
      }
    }),

    getPosts: publicProcedure
      .input(z.object({
        isPublic: z.boolean().optional().default(true),
        page: z.number().min(1).optional().default(1),
        take: z.number().min(1).max(10).optional().default(10),
      }))
      .query(async ({ ctx, input: { take, page, isPublic } }) => {
        const where = {
          isPublic,
        }
  
        const [posts, total] = await ctx.db.$transaction([
          ctx.db.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                }
              },
            },
            take,
            skip: take * (page - 1),
          }),
          ctx.db.post.count({ where }),
        ])
  
        return {
          posts,
          page,
          take,
          pageCount: Math.ceil(total / take),
          total,
        }
      }),
});
