import Link from "next/link";
import { getHrefToPost, transformDate } from "../../_utils/global.utils";
import { Fragment } from 'react'
import { PaginationLink } from "../../_components/PaginationLink";
import { type Post } from "@prisma/client";

type Content = {
    blocks?: {
        type: 'paragraph'
        data: {
            text: string
        }
    }[]
}

type PostsSidebarContainerProps = {
    posts: ({
        user: {
            id: string;
            name: string | null;
        };
    } & Post)[]
    pageCount: number
}

export const PostsSidebarContainer = ({
    posts,
    pageCount,
}: PostsSidebarContainerProps) => {
    return (
        <div className="container mx-auto flex flex-col lg:flex-row">
            <div className="flex flex-1 flex-col box-border px-8">
                {posts.map((post, index) => (
                    <Fragment key={post.id}>
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
                                    Napisane przez <Link href={`/autorzy/${post.user.id}`}>{post.user.name}</Link>
                                </p>
                            </article>
                        </Link>
                        {index + 1 !== posts.length && <div className="h-[1px] w-full bg-tertiary" />}
                    </Fragment>
                ))}
                <div className="flex flex-1 justify-center mt-8">
                    <PaginationLink count={pageCount} />
                </div>
            </div>
            <div className="flex lg:max-w-96 w-full">
            </div>
        </div>
    )
}
