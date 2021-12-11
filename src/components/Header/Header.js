import React from 'react'

import MenuProvider, { useMenuContext } from './../../context/MenuProvider'

import Menu from './Menu'
import Logo from './Logo'
import { GridLayout } from '../Layout'

import styles from './Header.module.css'
import gridStyles from '../Layout/GridLayout/GridLayout.module.css'
import utilStyles from '../../styles/utilStyles.module.css'

export default function Header({ siteTitle }) {
    return (
        <header>
            <MenuProvider>
                <HeaderContainer siteTitle={siteTitle} />
            </MenuProvider>
        </header>
    )    
}

function HeaderContainer({siteTitle}) {
    const { isOpen, isTop } = useMenuContext();
    
    return (
        <GridLayout className={`${styles.headerLayout}`}>
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