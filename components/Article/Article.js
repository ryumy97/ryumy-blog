import Link from 'next/link'

import Divider from '../Divider'

import styles from './Article.module.css'
import utilStyles from '../../styles/utilStyles.module.css'
import { formatDate } from '../../util/date'

export default function Article({ title, date, children, link, category }) {
    return (
        <div className={styles.container}>
            <div>
                <Link href={`/${link ? link : ""}`}>
                    <span className={styles.titleContainer}>
                        <h1 className={`${styles.title} ${utilStyles.link}`}>{title}</h1>
                    </span>
                </Link>
                {date
                ? <Link href="/date">
                    <span className={`${styles.subHeading} ${utilStyles.link}`}>
                        {formatDate(date)}
                    </span>
                </Link>
                : null}
                {(date && category) ? " | " : ""}
                {category
                ? <Link href={`/${category}`}>
                    <span className={`${styles.subHeading} ${utilStyles.link}`}>{category}</span>
                </Link>
                : null}
            </div>            
            <Divider spacing={4}/>
            <div className={styles.content}>
                {children}
            </div>
            <Divider spacing={12}/>
        </div>
    )
}