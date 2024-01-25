import { Editor } from "~/app/_components/Editor";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";

type EditPageProps = {
    params: {
        postId: string
    }
}

export default async function EditPage({ params }: EditPageProps) {
    const session = await getServerAuthSession();

    if (!session) {
        throw env.NOT_AUTHENTICATED_ERROR_MESSAGE
    }

    const post = await api.post.getEditPost.query({ id: Number(params.postId) });

    return (
        <Editor post={post} />
    )
}
