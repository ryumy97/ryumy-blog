import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import utilStyles from './../../../styles/utilStyles.module.css'

export default function MenuList({list}) {
    return (
        <ul>
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
        <li key={`${title}${index}`}>
            <Link href={`/${title}`} passHref>
                <a className={title === basePath ? utilStyles.currentLink : utilStyles.link}>{title}</a>
            </Link>
        </li> 
    )
}