import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from './Header.module.css'
import utilStyles from '../../styles/utilStyles.module.css'

export default function Header({ siteTitle }) {
    const router = useRouter();
    const basePath = router.route.split('/')[1];
    const [isTop, setIsTop] = useState(true)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY < 100 !== isTop) {
                setIsTop(window.scrollY < 100)
            }
        })
    }, [])

    return (
        <header className={isTop ? styles.header : `${styles.header} ${styles.shadow}`}>
            <div className={styles.headerContainer}>
                <Link href={'/'}>
                    <a className={utilStyles.link}>{siteTitle}.</a>
                </Link>
                <ul>
                    {["me","lab","log"].map(_ => (
                        <li key={_}>
                            <Link href={`/${_}`} passHref>
                                <a className={_ === basePath ? utilStyles.currentLink : utilStyles.link}>{_}</a>
                            </Link>
                        </li> 
                    ))}
                </ul>
            </div>
        </header>
    )    
}