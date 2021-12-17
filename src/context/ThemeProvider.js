import React, { useContext, useState, createContext } from "react";
import { Helmet } from 'react-helmet';

import utilStyles from 'styles/utilStyles.module.css'

const ThemeContext = createContext()

const themes = {
    red: {
        primary: '#FF4444',
        lightPrimary: '#ffbbbb',
    },
    purple: {
        primary: '#AB47BC',
        lightPrimary: '#E1BEE7'
    },
    green: {
        primary: '#2E7D32',
        lightPrimary: '#4CAF50',
    }
}

const common = {
    white: '#ffffff',
    grey: '#aaaaaa',
    dark: '#1E1E1E',
    disabled: '#cccccc'
}

export default function ThemeProvider({children}) {
    const getLastTheme = () => {
        const lastTheme = window.localStorage.getItem('theme');
        return lastTheme ? lastTheme : 'red';
    }

    const [theme, setThemeState] = useState(getLastTheme());
    
    const setTheme = (mode) => {
        window.localStorage.setItem('theme', mode);
        setThemeState(mode);
    };

    const getNextTheme = () => {
        const themeNames = Object.keys(themes);
        const themeIndex = themeNames.indexOf(theme);
        const nextKeyName = themeNames.length === themeIndex + 1
            ? themeNames[0]
            : themeNames[themeIndex + 1];

        return {
            ...common,
            ...themes[nextKeyName],
            key: nextKeyName
        };
    }

    return (
        <ThemeContext.Provider
            value={{
                setTheme,
                currentTheme: {
                    ...common,
                    ...themes[theme],
                    key: theme
                },
                getNextTheme
            }}
        >
            <DefaultStyles currentTheme={{
                    ...common,
                    ...themes[theme]
                }} />
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw Error("Need to wrap with Theme Provider");
    }

    return themeContext;
}

function DefaultStyles({ currentTheme }) {
    return (
        <Helmet>
            <style>{`
                .${utilStyles.grey_font} {
                    color: ${currentTheme.grey};
                }

                .${utilStyles.white_font} {
                    color: ${currentTheme.white};
                }
                .${utilStyles.currentLink} {
                    color: ${currentTheme.primary};
                }
                .${utilStyles.link} {
                    color: ${currentTheme.dark};
                }
                .${utilStyles.link}:hover {
                    color: ${currentTheme.primary};
                }
            `}</style>
        </Helmet>
    )
}