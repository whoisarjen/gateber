'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"

type FollowButtonProps = {
    userId: string
}

export const FollowButton = ({
    userId,
}: FollowButtonProps) => {
    const router = useRouter()
    const session = useSession()

    const user = api.user.getUserById.useQuery({ id: userId }, { enabled: !!userId })
    const isFollowing = api.follower.getIsFollowing.useQuery({ userId }, { enabled: !!userId && session.status === 'authenticated' })

    if (user.isError || user.isLoading || isFollowing.isError || isFollowing.isLoading || user.data.id === session.data?.user.id) {
        return null
    }

    const handleOnFollowClick = () => {
        if (session.status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }
    }

    const handleOnUnFollowClick = async () => {
        // asdasdas
        await isFollowing.refetch()
    }

    if (isFollowing) {
        return (
            <div className="primary-button" onClick={handleOnUnFollowClick}>
                Odobserwuj użytkownika
            </div>
        )
    }

    return (
        <div className="primary-button" onClick={handleOnFollowClick}>
            Obserwuj użytkownika
        </div>
    )
}