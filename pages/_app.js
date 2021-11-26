import App from 'next/app'
import Head from 'next/head'
import PostProvider from "../context/PostProvider"

import '../styles/global.css'

export default function app({ Component, pageProps}) {
    return (
        <PostProvider>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@200;300;400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
            </Head>
            <Component {...pageProps} />
        </PostProvider>    
    )
}