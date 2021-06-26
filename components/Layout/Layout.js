import Head from 'next/head'
import Link from 'next/link'

import Header from '../Header'
import Divider from '../Divider'

import styles from './Layout.module.css'
import utilStyles from '../../styles/utilStyles.module.css'

export const siteTitle = "ryumy"

export default function Layout({ title, date, children, link, category }) {
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="In Ha Ryu"
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summar_large_image"/>
            </Head>
            <Header siteTitle={siteTitle}/>
            <Divider spacing={16}/>
            <div className={styles.container}>
                <div>
                    <Link href={`/${link}`}>
                        <div className={styles.titleContainer}>
                            <h1 className={`${styles.title} ${utilStyles.link}`}>{title}</h1>
                        </div>
                    </Link>
                    <Link href="/date">
                        <date className={`${styles.subHeading} ${utilStyles.link}`}>
                            {date}
                        </date>
                    </Link>
                    {date & category ? " | " : ""}
                    <Link href={`/${category}`}>
                        <span className={`${styles.subHeading} ${utilStyles.link}`}>{category}</span>
                    </Link>
                </div>            
                <Divider spacing={4}/>
                {children}
            </div>
        </>
    )
}