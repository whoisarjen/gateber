import { api } from "~/trpc/server";
import { Editor } from "../../_components/Editor";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export default async function Create () {
    const session = await getServerAuthSession();

    if (!session) {
        throw env.NOT_AUTHENTICATED_ERROR_MESSAGE
    }

    const { isCreateLimit } = await api.post.verifyDailyCreateLimit.query()

    if (isCreateLimit) {
        return (
            <div>
                Dzienny limit postów został osiągnięty.
            </div>
        )
    }

    return (
        <Editor />
    )
}