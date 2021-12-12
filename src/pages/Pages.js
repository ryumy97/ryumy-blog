import React from 'react'
import {
    Routes,
    Route,
} from 'react-router-dom';

import Home from './home';
import Me from './me';
import NotFound from './notFound'

import PageLayout from 'components/Layout/PageLayout';

export default function Pages() {
    return(
        <PageLayout>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/me" element={<Me />}/>
                <Route path="*" element={<NotFound />}/>
            </Routes>
        </PageLayout>
    )
}
