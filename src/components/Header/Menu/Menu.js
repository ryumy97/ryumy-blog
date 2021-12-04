import React, { useState, useEffect, useRef } from 'react'
import MenuDrag from './MenuDrag'
import MenuList from './MenuList'
import { GridLayout } from '../../Layout'

import styles from './Menu.module.css'
import MenuClose from './MenuClose'

export default function Menu({list, isTop}, ref) {
    const [isOpen, setIsOpen] = useState(false);

    const MenuRef = useRef();

    const openMenu = () => {
        if (isTop) {
            setIsOpen(prev => !prev);
        }
        else {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    const closeMenu = () => {
        setIsOpen(false);
    }
    
    useEffect(() => {
        if (!isTop) {
            setIsOpen(false)
        }
    }, [isTop])


    return (
        <>
            <div className={`${styles.menuDropDownContainer} ${isTop ? styles.isTop : ''} ${isOpen ? styles.isOpen : ''}`}>
                <GridLayout
                    ref={MenuRef}
                    className={styles.menuDropDownGrid}
                >
                    <MenuList list={list} isOpen={isOpen}></MenuList>
                </GridLayout>
            </div>

            <MenuClose
                closeMenu={closeMenu}
                isOpen={isOpen}
            />
            
            <MenuDrag 
                openMenu={openMenu}
                isOpen={isOpen}
                isTop={isTop}
                dropDownRef={MenuRef}
            />
        </>
    )
}