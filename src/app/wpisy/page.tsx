import { api } from "~/trpc/server";
import { PostsSidebarContainer } from "../_containers/PostsSidebarContainer";

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
    const { posts, pageCount } = await api.post.getPosts.query({ page: Number(strona) });

    return (
        <PostsSidebarContainer
            posts={posts}
            pageCount={pageCount}
        />
    )
}