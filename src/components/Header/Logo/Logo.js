import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

import { useMenuContext } from 'context/MenuProvider'
import styles from './Logo.module.css';
import utilStyles from 'styles/utilStyles.module.css'

export default function Logo({siteTitle, className, style}) {
    const { pathname } = useLocation();
    const { closeMenu } = useMenuContext();

    const [isCurrentLink, setIsCurrentLink] = useState(true);

    useEffect(() => {
        setIsCurrentLink(pathname === '/');
    }, [pathname])


    return (
        <div style={style} className={`${styles.logoWrapper} ${className}`}>
            {isCurrentLink
                ? <span onClick={closeMenu} className={`${utilStyles.link}`}>
                    {siteTitle}.
                </span>
                : <Link to={'/'} className={`${utilStyles.link}`}>
                    {siteTitle}.
                </Link>
            }
        </div>
    )
}