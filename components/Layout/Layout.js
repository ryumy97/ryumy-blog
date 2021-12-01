import React, {useState} from 'react'

import Head from 'next/head'

import Header from '../Header'
import Divider from '../Divider'

export const siteTitle = "ryumy"

export default function Layout({ children }) {
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
            {children}
        </>
    )
}