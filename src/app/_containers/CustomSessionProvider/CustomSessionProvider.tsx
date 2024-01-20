"use client";

import { SessionProvider } from "next-auth/react"

import React from 'react'

export const CustomSessionProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
