import React from 'react'
import { Link, useLocation } from 'react-router-dom';

import styles from './MenuListItem.module.css'
import utilStyles from './../../../../styles/utilStyles.module.css'

export default function MenuListItem({title, index}) {
    const location = useLocation();
    const path = location.pathname;

    return (
        <li 
            className={styles.listitem}
            key={`${title}${index}`}
            style={{
                animationDelay: `${0.5 + 0.1*index}s`
            }}
        >
            <Link
                to={`/${title}`}
                className={`${
                    title === path.split('/')[1]
                        ? utilStyles.currentLink
                        : `${utilStyles.link} ${utilStyles.white_font}`
                    }`}
            >
                {title}
            </Link>
        </li> 
    )
}