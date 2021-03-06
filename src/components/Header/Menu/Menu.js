import React, { useRef } from 'react'

import { useMenuContext } from 'context/MenuProvider'
import { useTheme } from 'context/ThemeProvider';

import MenuDrag from './MenuDrag'
import MenuList from './MenuList'
import MenuClose from './MenuClose'
import { GridLayout } from '../../Layout'

import styles from './Menu.module.css'

export default function Menu({list}) {
    const { isTop, isOpen, openMenu, closeMenu } = useMenuContext();
    const { currentTheme } = useTheme();

    const MenuRef = useRef();

    return (
        <>
            <div 
                className={`${styles.menuDropDownContainer} ${isTop ? styles.isTop : ''} ${isOpen ? styles.isOpen : ''}`}
                style={{backgroundColor: currentTheme.primary}}
            >
                <GridLayout
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