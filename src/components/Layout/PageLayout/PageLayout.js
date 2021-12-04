import React from 'react'

import Header from '../../Header'
import Divider from '../../Divider'
import { siteTitle } from '../../../constants'

export default function PageLayout({ children }) {
    return (
        <>
            <Header siteTitle={siteTitle}/>
            <Divider spacing={16}/>
            {children}
        </>
    )
}