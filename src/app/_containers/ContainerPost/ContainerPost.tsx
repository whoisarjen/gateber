import { type Post } from "@prisma/client"
import Link from "next/link"
import { getHrefToPost, transformDate } from "~/app/_utils/global.utils"

type Content = {
    blocks?: {
        type: 'paragraph'
        data: {
            text: string
        }
    }[]
}

type ContainerPostProps = {
    user: {
        id: string;
        name: string | null;
    };
} & Post

export const ContainerPost = (post: ContainerPostProps) => {
    return (
        <Link href={getHrefToPost(post)} className="text-black no-underline">
            <article>
                <p>{transformDate(post.updatedAt)}</p>
                <h2 className="text-base line-clamp-2">
                    {post.title}
                </h2>
                <p className="line-clamp-3">
                    {(post.content as unknown as Content).blocks?.find(({ type }) => type === 'paragraph')?.data.text}
                </p>
                <p>
                    Napisane przez <Link href={`/authors/${post.user.id}`}>{post.user.name}</Link>
                </p>
            </article>
        </Link>
    )
}
