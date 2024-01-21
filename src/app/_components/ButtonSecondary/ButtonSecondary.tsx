import Link, { type LinkProps } from "next/link"

export type ButtonSecondaryProps = {
    children: React.ReactNode
    className?: string
} & LinkProps

export const ButtonSecondary = ({
    children,
    className = '',
    ...props
}: ButtonSecondaryProps) => {
    return (
        <Link {...props} className={`py-3 px-6 rounded-md bg-secondary text-primary border-none cursor-pointer font-bold no-underline ${className}`}>
          {children}
        </Link>
    )
}
