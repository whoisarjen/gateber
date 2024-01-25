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
        <Link {...props} className={`primary-button ${className}`}>
          {children}
        </Link>
    )
}
