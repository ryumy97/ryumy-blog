import React from 'react'
import { Helmet } from 'react-helmet'

import Header from '../Header'
import Divider from '../Divider'

export const siteTitle = "ryumy"

export default function Layout({ children }) {
    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="In Ha Ryu"
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summar_large_image"/>
            </Helmet>
            <Header siteTitle={siteTitle}/>
            <Divider spacing={16}/>
            {children}
        </>
    )
}