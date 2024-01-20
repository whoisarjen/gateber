import { Editor } from "~/app/_components/Editor";
import { api } from "~/trpc/server";

type EditPageProps = {
    params: {
        postId: string
    }
}

export default async function EditPage({ params }: EditPageProps) {
    const post = await api.post.getEditPost.query({ id: Number(params.postId) });

    return (
        <Editor post={post} />
    )
}
