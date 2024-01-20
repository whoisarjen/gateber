import { api } from "~/trpc/server";
import { EditorJsRenderer } from "../../_components/EditorJsRenderer";
import { type OutputData } from "@editorjs/editorjs";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import { env } from "~/env";

type PostProps = {
    params: {
        postSlug: string
    }
}

export default async function Post({ params }: PostProps) {
    const session = await getServerAuthSession();
    const post = await api.post.getPost.query({ id: Number(params.postSlug.split('-').at(0)) });

    return (
        <article className="container mx-auto prose lg:prose-xl">
            {session?.user.id === post.userId && <Link href={`/edit/${post.id}`}>Edytuj wpis</Link>}
            <h1>{post.title}</h1>
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
                        Ostatnia aktualizacja {new Date(post.updatedAt).toLocaleString('en-GB')}
                    </div>
                </div>
            </div>
            <EditorJsRenderer data={post.content as unknown as OutputData} />
        </article>
    )
}