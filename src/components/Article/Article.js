import React from 'react'
import { Link } from 'react-router-dom'

import Divider from '../Divider'

import styles from './Article.module.css'
import utilStyles from '../../styles/utilStyles.module.css'
import { formatDate } from '../../util/date'

export default function Article({ title, date, children, link, category }) {
    return (
        <article className={styles.container}>
            <div>
                <Link to={`/${link ? link : ""}`}>
                    <div className={styles.titleContainer}>
                        <h1 className={`${styles.title} ${utilStyles.link}`}>{title}</h1>
                    </div>
                </Link>
                {date
                ? <Link to="/date" className={`${styles.subHeading} ${utilStyles.link}`}>
                    {formatDate(date)}
                </Link>
                : null}
                {(date && category) ? " | " : ""}
                {category
                ? <Link to={`/${category}`} className={`${styles.subHeading} ${utilStyles.link}`}>
                    {category}
                </Link>
                : null}
            </div>            
            <Divider spacing={4}/>
            <div className={styles.content}>
                {children}
            </div>
            <Divider spacing={12}/>
        </article>
    )
}