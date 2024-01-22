import { api } from "~/trpc/server";
import { ContainerRightSidebar } from "~/app/_containers/ContainerRightSidebar";
import { Divider } from "~/app/_components/Divider";
import { Fragment } from "react";
import { ContainerPost } from "~/app/_containers/ContainerPost";
import { PaginationLink } from "~/app/_components/PaginationLink";

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
        <ContainerRightSidebar>
            <div className="flex flex-1 flex-col box-border px-8">
                {posts.map((post, index) => (
                    <Fragment key={post.id}>
                        <ContainerPost {...post} />
                        {index + 1 !== posts.length && <Divider />}
                    </Fragment>
                ))}
                <div className="flex flex-1 justify-center mt-8">
                    <PaginationLink count={pageCount} />
                </div>
            </div>
        </ContainerRightSidebar>
    )
}