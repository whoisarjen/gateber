import Link from "next/link";
import { api } from "~/trpc/server";
import { getHrefToPost } from "../_utils/links.utils";
import { Fragment } from 'react'

type PostsProps = {
    searchParams: {
        strona: string
    }
}

export default async function Posts ({
    searchParams: {
        strona = '1',
    }
}: PostsProps) {
    const posts = await api.post.getPosts.query({ strona: Number(strona) });

    return (
        <div className="container mx-auto flex">
            <div className="flex flex-1 flex-col box-border px-8">
                {posts.map((post, index) => (
                    <Fragment key={post.id}>
                        <Link href={getHrefToPost(post)} className="text-black no-underline">
                            <article>
                                <h2 className="text-sm">
                                    {post.title}
                                </h2>
                                <p>

                                </p>
                            </article>
                        </Link>
                        {index + 1 !== posts.length && <div className="h-[1px] w-full bg-tertiary" />}
                    </Fragment>
                ))}
            </div>
            <div className="flex max-w-96 w-full">
                
            </div>
        </div>
    )
}