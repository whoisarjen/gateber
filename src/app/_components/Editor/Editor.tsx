'use client'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Post } from '@prisma/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type CreatePostSchema, createPostSchema } from '~/app/_schemas/posts.schema'
import { api } from "~/trpc/react";
import { customRevalidatePath } from '~/app/_utils/cache.utils'
import { useRouter } from 'next/navigation'
import { getHrefToPost } from '~/app/_utils/links.utils'
import { TextareaAutosize } from '@mui/base';

type EditorProps = {
  post?: Post
}

export const Editor = ({
  post,
}: EditorProps) => {
  const router = useRouter()
  const createPost = api.post.create.useMutation({
    onSuccess: (post) => {
      console.log('success', { post })
      router.push(getHrefToPost(post))
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: (post) => {
      console.log('updated', { post })
      router.push(getHrefToPost(post))
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    criteriaMode: "all",
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: {},
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  useEffect(() => {
    setValue('title', post?.title ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.title])

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
      {Object.values(errors).map(({ type, message }) => (
        <p
          key={type}
          className="text-red-500"
        >
          {message}
        </p>
      ))}
      <form
        id='subreddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}>
        <button>
          Zapisz
        </button>
        <TextareaAutosize
          ref={(e) => {
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
