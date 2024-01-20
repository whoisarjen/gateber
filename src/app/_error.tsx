'use client'
 
import { useEffect } from 'react'

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
    useEffect(() => {
        console.log({ error })
    }, [error])

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
