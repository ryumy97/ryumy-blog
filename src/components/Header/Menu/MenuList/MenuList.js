import React from 'react'

import MenuListItem from './MenuListItem'

import styles from './MenuList.module.css'

export default function MenuList({list, isOpen}) {
    return (
        <ul className={`${styles.list} ${isOpen ? styles.open : styles.closed}`}>
            {list.map((_, i) => (
                <MenuListItem key={`${_}${i}`} title={_} index={i}/>
            ))}
        </ul>
    )
}
