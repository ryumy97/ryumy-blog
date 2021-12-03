import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Menu from './Menu'

import styles from './Header.module.css'
import utilStyles from '../../styles/utilStyles.module.css'

export default function Header({ siteTitle }) {
    const [isTop, setIsTop] = useState(true)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                setIsTop(false)
            }
            else if(window.scrollY < 200) {
                setIsTop(true)
            }
        })
    }, [])

    return (
        <header className={isTop ? styles.header : `${styles.header} ${styles.shadow}`}>
            <div className={styles.headerContainer}>
                <Link to={'/'} className={`${utilStyles.link}`}>
                    {siteTitle}.
                </Link>
                <Menu list={["me","lab","log"]} isTop={isTop}/>
            </div>
        </header>
    )    
}