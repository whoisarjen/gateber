import { api } from "~/trpc/server";
import { Editor } from "../../_components/Editor";

export default async function Create () {
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