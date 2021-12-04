import React, { useState } from 'react'

import Menu from './Menu'
import Logo from './Logo'
import { GridLayout } from '../Layout'

import styles from './Header.module.css'

export default function Header({ siteTitle }) {
    const [isTop, setIsTop] = useState(true)

    document.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            setIsTop(false)
        }
        else if(window.scrollY < 200) {
            setIsTop(true)
        }
    })

    return (
        <header>
            <GridLayout className={styles.headerLayout}>
                <Logo siteTitle={siteTitle} ></Logo>
                <Menu 
                    list={["me","lab","log"]}
                    isTop={isTop}
                />
            </GridLayout>
        </header>
    )    
}