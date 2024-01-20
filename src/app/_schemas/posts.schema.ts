import { z } from "zod";

const hasIdSchema = z.object({ id: z.number() });

export const createPostSchema = z.object({
    title: z
      .string()
      .min(3, {
        message: 'Tytuł musi mieć conajmniej 3 litery',
      })
      .max(128, {
        message: 'Tytuł może mieć maksymalnie 128 liter',
      }),
    content: z.object({}).catchall(z.any()),
  })

export type CreatePostSchema = z.infer<typeof createPostSchema>

export const updatePostSchema = createPostSchema.merge(hasIdSchema)

export type UpdatePostSchema = z.infer<typeof updatePostSchema>
