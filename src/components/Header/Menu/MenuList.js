import React from 'react'
import { Link, useLocation } from 'react-router-dom';

import styles from './MenuList.module.css'
import utilStyles from './../../../styles/utilStyles.module.css'

export default function MenuList({list, isOpen}) {
    return (
        <ul className={`${styles.list} ${isOpen ? styles.open : styles.closed}`}>
            {list.map((_, i) => (
                <MenuListItem key={`${_}${i}`} title={_} index={i}/>
            ))}
        </ul>
    )
}

function MenuListItem({title, index}) {
    const location = useLocation();
    const path = location.pathname;

    return (
        <li 
            className={styles.listitem}
            key={`${title}${index}`}
            style={{
                animationDelay: `${0.5 + 0.25*index}s`
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