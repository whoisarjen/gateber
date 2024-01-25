'use client'
 
import { useRouter } from 'next/navigation'
import { env } from "~/env";

type ErrorProps = {
    error: Error & {
        digest?: string
        message?: string
    }
    reset: () => void
}
 
export default function Error({
  error,
  reset,
}: ErrorProps) {
    const router = useRouter()

    if (error.message.includes(env.NEXT_PUBLIC_NOT_AUTHENTICATED_ERROR_MESSAGE)) {
        router.push('/api/auth/signin')
        return null
    }

    return (
        <div className="container mx-auto flex flex-col items-center">
            <h2>Coś poszło nie tak!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()} >
                Odśwież
            </button>
        </div>
    )
}
