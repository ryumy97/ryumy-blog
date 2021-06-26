import App from 'next/app'

import '../styles/global.css'

export default function app({ Component, pageProps}) {
    return <Component {...pageProps} />
}