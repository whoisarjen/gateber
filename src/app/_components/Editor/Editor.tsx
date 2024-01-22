'use client'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Post } from '@prisma/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type CreatePostSchema, createPostSchema } from '~/app/_schemas/posts.schema'
import { api } from "~/trpc/react";
import { customRevalidatePath } from '~/app/_utils/cache.utils'
import { useRouter } from 'next/navigation'
import { getHrefToPost } from '~/app/_utils/global.utils'
import { TextareaAutosize } from '@mui/base';
import { useForm, Controller } from "react-hook-form"
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

type EditorProps = {
  post?: Post
}

export const Editor = ({
  post,
}: EditorProps) => {
  const router = useRouter()
  const createPost = api.post.create.useMutation({
    onSuccess: (post) => {
      router.push(getHrefToPost(post))
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: (post) => {
      router.push(getHrefToPost(post))
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    criteriaMode: "all",
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: post?.title ?? '',
      isPublic: post?.isPublic ?? false,
      content: (post?.content ?? {}) as unknown as any,
    },
  })
  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const Table = (await import('@editorjs/table')).default
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const List = (await import('@editorjs/list')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Tu zacznij pisać swój wpis...',
        inlineToolbar: true,
        data: post?.content as unknown as OutputData ?? { blocks: [] },
        tools: {
          header: Header,
          list: List,
          table: Table,
        },
      })
    }
  }, [post?.id])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef?.current?.focus()
      }, 0)
    }

    if (isMounted) {
      void init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const onSubmit = async (data: CreatePostSchema) => {
    const content = await ref.current?.save() as unknown as CreatePostSchema["content"]

    if (post) {
      const update = {
        ...post,
        ...data,
        content,
      }

      updatePost.mutate(update)
      customRevalidatePath('/dashboard/edit/[postId]')
      customRevalidatePath(getHrefToPost(update))
      return
    }

    customRevalidatePath('/dashboard/create')
    createPost.mutate({
      ...data,
      content,
    })
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register('title')

  return (
    <article className="container mx-auto prose lg:prose-xl">
      {Object.values(errors).map(({ type, message }: any) => (
        <p
          key={type}
          className="text-warning"
        >
          {message}
        </p>
      ))}
      <form
        id='subreddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-1 justify-between mb-6">
            <div>
              <button>
                Zapisz
              </button>
            </div>
            {!!post &&
              <div>
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={<Switch
                        checked={value}
                        onChange={onChange}
                        color="primary"
                      />}
                      label={value ? 'Publiczny' : 'Prywatny'}
                      labelPlacement="start"
                    />
                  )}
                />
              </div>
            }
          </div>
        <TextareaAutosize
          ref={(e: any) => {
            titleRef(e)
            // @ts-expect-error it's fine, trust me!
            _titleRef.current = e
          }}
          {...rest}
          placeholder='Tytuł'
          className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold border-0 focus:outline-none'
        />
        <div id='editor' className='text-black' />
      </form>
    </article>
  )
}
