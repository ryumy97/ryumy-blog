import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

import { useMenuContext } from 'context/MenuProvider'

import styles from './MenuListItem.module.css'
import utilStyles from 'styles/utilStyles.module.css'

export default function MenuListItem({title, index}) {
    const location = useLocation();
    const { closeMenu } = useMenuContext();

    const [isCurrentLink, setIsCurrentLink] = useState(true);

    useEffect(() => {
        setIsCurrentLink(title === location.pathname.split('/')[1])
    }, [location, title])

    return (
        <li 
            className={styles.listitem}
            key={`${title}${index}`}
            style={{
                animationDelay: `${0.5 + 0.1*index}s`
            }}
        >
            {isCurrentLink
                ?<span
                    className={`${utilStyles.currentLink} ${styles.menuLink}`}
                    onClick={() => {closeMenu()}}
                >
                    {title}
                </span>
                :<Link
                    to={`/${title}`}
                    className={`${styles.menuLink}`}
                >
                    {title}
                </Link>
            }
        </li> 
    )
}