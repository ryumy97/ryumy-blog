import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

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
    const router = useRouter();
    const basePath = router.route.split('/')[1];

    return (
        <li 
            className={styles.listitem}
            key={`${title}${index}`}
            style={{
                animationDelay: `${0.5 + 0.25*index}s`
            }}
        >
            <Link href={`/${title}`} passHref shallow={true} >
                <a 
                    className={`${
                        title === basePath
                            ? utilStyles.currentLink
                            : `${utilStyles.link} ${utilStyles.white_font}`
                        }`
                    }
                >
                    {title}
                </a>
            </Link>
        </li> 
    )
}