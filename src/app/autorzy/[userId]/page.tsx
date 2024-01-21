import { api } from "~/trpc/server";
import { PostsSidebarContainer } from "~/app/_containers/PostsSidebarContainer";

type UserIdProps = {
    params: {
        userId: string
    }
    searchParams: {
        strona: string
    }
}

export default async function AuthorUserId ({
    searchParams: {
        strona = '1',
    },
    params: {
        userId,
    },
}: UserIdProps) {
    const { posts, pageCount } = await api.post.getPostsByUserId.query({ page: Number(strona), userId });

    return (
        <PostsSidebarContainer
            posts={posts}
            pageCount={pageCount}
        />
    )
}