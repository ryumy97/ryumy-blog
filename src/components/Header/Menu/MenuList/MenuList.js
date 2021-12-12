import React from 'react'

import { useTheme } from 'context/ThemeProvider';

import MenuListItem from './MenuListItem'
import menyListItemStyles from './MenuListItem.module.css'

import styles from './MenuList.module.css'
import gridStyles from 'styles/grid.module.css'

export default function MenuList({list, isOpen}) {
    const { currentTheme } = useTheme();
    
    return (
        <nav className={gridStyles.column_start_3}>
            <style>{`
                .${menyListItemStyles.menuLink} {
                    color: ${currentTheme.white};
                }
                .${menyListItemStyles.menuLink}:hover {
                    color: ${currentTheme.lightPrimary};
                }
            `}</style>
            <ul className={`${styles.list} ${isOpen ? styles.open : styles.closed}`}>
                {list.map((_, i) => (
                    <MenuListItem key={`${_}${i}`} title={_} index={i}/>
                ))}
            </ul>
        </nav>
    )
}
