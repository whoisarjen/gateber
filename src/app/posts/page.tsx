import { api } from "~/trpc/server";
import { Divider } from '~/app/_components/Divider';
import { Fragment } from 'react'
import { ContainerPost } from "../_containers/ContainerPost";
import { PaginationLink } from "../_components/PaginationLink";
import { ContainerRightSidebar } from "../_containers/ContainerRightSidebar";

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