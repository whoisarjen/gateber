type ContainerRightSidebarProps = {
    children: React.ReactNode
    sidebarContent?: React.ReactNode
}

export const ContainerRightSidebar = ({
    children,
    sidebarContent
}: ContainerRightSidebarProps) => {
    return (
        <div className="container mx-auto flex flex-col lg:flex-row">
            {children}
            <div className="flex lg:max-w-96 w-full">
                {sidebarContent}
            </div>
        </div>
    )
}
