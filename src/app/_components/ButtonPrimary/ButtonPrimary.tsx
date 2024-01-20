import Link, { type LinkProps } from "next/link"

export type ButtonPrimaryProps = {
    children: React.ReactNode
    className?: string
} & LinkProps

export const ButtonPrimary = ({
    children,
    className = '',
    ...props
}: ButtonPrimaryProps) => {
    return (
        <Link {...props} className={`shadow py-4 px-8 rounded-md bg-primary text-white border-none cursor-pointer font-bold no-underline ${className}`}>
          {children}
        </Link>
    )
}
