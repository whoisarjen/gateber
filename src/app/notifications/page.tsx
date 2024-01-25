import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export default async function Notifications () {
    const session = await getServerAuthSession();

    if (!session) {
        throw env.NOT_AUTHENTICATED_ERROR_MESSAGE
    }

    return (
        <div>
            Brak nowych powiadomień
        </div>
    )
}
