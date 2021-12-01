import React, { useState, useEffect, useRef } from 'react'
import MenuDrag from './MenuDrag'
import MenuList from './MenuList'

import styles from './Menu.module.css'
import utilStyles from '../../../styles/utilStyles.module.css'

export default function Menu({list, isTop}) {
    const [isOpen, setOpen] = useState(false)
    const dropDownRef = useRef();

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
        <div 
            className={`${styles.menuDropDownContainer} ${isTop ? '' : styles.top} ${isOpen ? styles.open : ''} ${utilStyles.disableSelect}`}
        >    
            <MenuDrag openMenu={openMenu} isOpen={isOpen} isTop={isTop} dropDownRef={dropDownRef} />
            <div 
                className={`${styles.menuDropDown} ${isOpen ? styles.open : ''}`} 
                ref={ dropDownRef }
            >
                <MenuList list={list} isOpen={isOpen} ></MenuList>
            </div>
        </div>
    )
}