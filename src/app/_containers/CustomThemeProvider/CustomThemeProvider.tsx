'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: 'inherit',
    }
});

type CustomThemeProviderProps = {
    children: React.ReactNode
}

export const CustomThemeProvider = ({
    children,
}: CustomThemeProviderProps) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}