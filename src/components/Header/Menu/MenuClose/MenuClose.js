import React, { useEffect, useRef } from 'react'

import styles from './MenuClose.module.css'

export default function MenuClose({closeMenu, isOpen}) {
    const closeIconTopToBottomRef = useRef();
    const closeIconBottomToTopRef = useRef();

    const menuCloseWidth = Math.sqrt(Math.pow(24, 2) + Math.pow(24, 2));

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
            onClick={closeMenu}
        >
            <div className={styles.closeIconContainer}>
                <div className={styles.closeIconTop}/>
                <div className={styles.closeIconBottom}/>
                <div ref={closeIconTopToBottomRef} className={styles.closeIconTopToBottom}/>
                <div ref={closeIconBottomToTopRef} className={styles.closeIconBottomToTop}/>
            </div>
        </div>
    )
}