import { z } from "zod";
import { createPostSchema, updatePostSchema } from "~/app/_schemas/posts.schema";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { api } from "~/trpc/server";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { isCreateLimit } = await api.post.verifyDailyCreateLimit.query()

      if (isCreateLimit) {
        throw new Error("Daily create limit reached");
      }

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
      numberOfRelatedPosts: z.number().optional().default(3),
    }))
    .query(async ({ ctx, input: { id, isPublic, numberOfRelatedPosts } }) => {
      const post = await ctx.db.post.findFirstOrThrow({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
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

    const relatedPosts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
      },
      where: {
        userId: post.user.id,
        isPublic,
        NOT: {
          id,
        }
      },
      take: numberOfRelatedPosts,
    })

    return {
      post,
      relatedPosts,
    }
  }),

  getPostsByUserId: publicProcedure
    .input(z.object({
      userId: z.string(),
      isPublicOnly: z.boolean().optional().default(true),
      page: z.number().min(1).optional().default(1),
      take: z.number().min(1).max(10).optional().default(10),
    }))
    .query(async ({ ctx, input: { take, page, userId, isPublicOnly } }) => {
      const where = {
          ...(isPublicOnly ? { isPublic: true } : {}),
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
        page: z.number().min(1).optional().default(1),
        take: z.number().min(1).max(10).optional().default(10),
      }))
      .query(async ({ ctx, input: { take, page } }) => {
        const where = {
          isPublic: true,
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

  verifyDailyCreateLimit: protectedProcedure
    .query(async ({ ctx }) => {
      const currentDate = new Date();
      const yesterday = new Date();
      yesterday.setDate(currentDate.getDate() - 1);
      yesterday.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());

      const posts = await ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gt: yesterday,
          }
        },
      })

      const postsCount = posts.length

      return {
        postsCount,
        earliestPostCreatedAt: posts.at(-1)?.createdAt,
        isCreateLimit: postsCount >= env.LIMIT_CREATE_POSTS_PER_DAY,
      }
    }),
});
