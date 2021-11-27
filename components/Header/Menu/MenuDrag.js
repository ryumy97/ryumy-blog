import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

import styles from './MenuDrag.module.css'

import MenuList from './MenuList';

export default function MenuDrag({list, isTop}) {
    const [isOpen, setOpen] = useState(false)

    const openMenu = () => {
        if (isTop) {
            setOpen(prev => !prev);
        }
        else {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    useEffect(() => {
        if (!isTop) {
            setOpen(false)
        }
    }, [isTop])

    return (
        <div className={`${styles.menuDropDownContainer} ${isTop ? '' : styles.top}`}>
            <div className={`${styles.menuDrag} ${isOpen ? styles.open : ''}`}>
                <div className={styles.menuContainer} onClick={openMenu}>
                    <FontAwesomeIcon icon={faBars} className={styles.hamburger}/>
                </div>
            </div>
            <div className={`${styles.menuDropDown} ${isOpen ? styles.open : ''}`}>
                <MenuList list={list} isOpen={isOpen} ></MenuList>
            </div>
        </div>
    )
}