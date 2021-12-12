import React from 'react'
import { Link } from 'react-router-dom'

import styles from './Logo.module.css';
import utilStyles from 'styles/utilStyles.module.css'

export default function Logo({siteTitle, className, style}) {
    return (
        <div style={style} className={`${styles.logoWrapper} ${className}`}>
            <Link to={'/'} className={`${utilStyles.link}`}>
                {siteTitle}.
            </Link>
        </div>
    )
}