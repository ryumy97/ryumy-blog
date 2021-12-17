import React, { useEffect, useRef } from 'react'

import { useTheme } from 'context/ThemeProvider'

import styles from './MenuClose.module.css'

export default function MenuClose({closeMenu, isOpen}) {
    const { currentTheme } = useTheme();

    const closeIconTopToBottomRef = useRef();
    const closeIconBottomToTopRef = useRef();

    const menuCloseWidth = Math.sqrt(Math.pow(16, 2) + Math.pow(16, 2));

    useEffect(() => {
        if (closeIconTopToBottomRef.current) {
            closeIconTopToBottomRef.current.style.width = `${menuCloseWidth}px`
        }
    }, [closeIconBottomToTopRef, menuCloseWidth])
    
    useEffect(() => {
        if (closeIconBottomToTopRef.current) {
            closeIconBottomToTopRef.current.style.width = `${menuCloseWidth}px`
        }
    }, [closeIconBottomToTopRef, menuCloseWidth])

    return (
        <div
            className={`${styles.menuClose} ${isOpen ? styles.open : styles.closed}`}
        >
            <div
                className={styles.closeIconContainer}            
                onClick={closeMenu}
            >
                <div style={{backgroundColor: currentTheme.dark}} className={styles.closeIconTop}/>
                <div style={{backgroundColor: currentTheme.dark}} className={styles.closeIconBottom}/>
                <div ref={closeIconTopToBottomRef} style={{backgroundColor: currentTheme.dark}} className={styles.closeIconTopToBottom}/>
                <div ref={closeIconBottomToTopRef} style={{backgroundColor: currentTheme.dark}} className={styles.closeIconBottomToTop}/>
            </div>
        </div>
    )
}