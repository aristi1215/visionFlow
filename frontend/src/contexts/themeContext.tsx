import { createContext, useContext, useEffect, useState } from 'react'


type ThemeContextType = {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }

    return context;
}



export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light';

        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        return savedTheme;
    })


    const toggleTheme = () => {
        setTheme(prev => prev == 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        const root = document.documentElement

        root.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )

}