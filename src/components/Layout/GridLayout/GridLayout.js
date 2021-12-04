import React from 'react'

import styles from './GridLayout.module.css'

export default function GridLayout({ children, className }) {
    return(
        <div className={`${styles.grid} fullScreen ${className ? className : ''}`}>
            {children}
        </div>
    );
}