'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: 'inherit',
    },
    palette: {
        primary: {
            main: '#4f46ba',
        },
        secondary: {
            main: '#f7f9fb',
        },
        warning: {
            main: '#FF0000',
        },
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