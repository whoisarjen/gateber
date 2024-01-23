import { api } from "~/trpc/server";
import { EditorJsRenderer } from "../../_components/EditorJsRenderer";
import { type OutputData } from "@editorjs/editorjs";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import { env } from "~/env";
import { transformDate } from "~/app/_utils/global.utils";
import { ContainerPost } from "~/app/_containers/ContainerPost";
import { CustomDivider } from "~/app/_components/CustomDivider";
import { Fragment } from "react";
import type { Metadata } from 'next'

type PostProps = {
    params: {
        postSlug: string
    }
}

export async function generateMetadata({
    params,
}: PostProps): Promise<Metadata> {
    const { post } = await api.post.getPost.query({ id: Number(params.postSlug.split('-').at(0)) })
   
    return {
        title: post.title,
    }
}

export default async function Post({ params }: PostProps) {
    const [
        session,
        { post, relatedPosts },
    ] = await Promise.all([
        getServerAuthSession(),
        api.post.getPost.query({ id: Number(params.postSlug.split('-').at(0)) }),
    ])

    return (
        <article className="container mx-auto prose lg:prose-xl">
            {session?.user.id === post.user.id && <Link href={`/dashboard/edit/${post.id}`}>Edytuj wpis</Link>}
            <h1>{post.title}</h1>
            {!post.isPublic && <p className="text-warning">Prywatny</p>}
            <div className="flex gap-8 items-center">
                {post.user.image &&
                    <Image
                        src={post.user.image}
                        alt={`${env.SITE_NAME} ${post.user.name}`}
                        className="rounded-full"
                        height={44}
                        width={44}
                    />
                }
                <div className="flex flex-col">
                    <div>
                        {post.user.name}
                    </div>
                    <div>
                        Ostatnia aktualizacja {transformDate(post.updatedAt)}
                    </div>
                </div>
            </div>
            <EditorJsRenderer data={post.content as unknown as OutputData} />
            {!!relatedPosts.length && <CustomDivider />}
            {relatedPosts.map((post, index) => (
                <Fragment key={post.id}>
                    <ContainerPost {...post} />
                    {index + 1 !== relatedPosts.length && <CustomDivider />}
                </Fragment>
            ))}
        </article>
    )
}