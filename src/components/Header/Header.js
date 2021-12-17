import React from 'react'

import { useMenuContext } from 'context/MenuProvider'
import { useTheme } from 'context/ThemeProvider'

import Menu from './Menu'
import Logo from './Logo'
import { GridLayout } from '../Layout'

import styles from './Header.module.css'
import gridStyles from 'styles/grid.module.css'
import utilStyles from 'styles/utilStyles.module.css'

export default function Header({ siteTitle }) {
    return (
        <header>
            <HeaderContainer siteTitle={siteTitle} />
        </header>
    )    
}

function HeaderContainer({siteTitle}) {
    const { isOpen, isTop } = useMenuContext();
    const { currentTheme } = useTheme();
    
    return (
        <GridLayout className={`${styles.headerLayout}`}>
            <style>
                {`
                    .${styles.logo}::before {
                        background-color: ${currentTheme.primary};
                    }
                    .${styles.logo}.${styles.open}::before {
                        background-color: ${currentTheme.white};
                    }
                    .${styles.logo}.${styles.open} * {
                        color: ${currentTheme.white};
                    }
                    .${styles.logo}.${styles.open} *:hover {
                        color: ${currentTheme.lightPrimary};
                    }
                `}
            </style>
            <Logo
                siteTitle={siteTitle}
                className={`${styles.logo} ${isTop ? styles.top : styles.notTop} ${isOpen ? styles.open : ''}`}
            ></Logo>
            <div className={`${utilStyles.grey_font} ${gridStyles.column_start_3} ${isTop ? styles.top : styles.notTop}`}>
                In Ha Ryu's personal blog
            </div>
            <Menu 
                list={["me","lab","log"]}
            />
        </GridLayout>
    )

}