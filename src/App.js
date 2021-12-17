import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import PostProvider from './context/PostProvider';
import MouseTracker from './context/MouseTracker';
import ThemeProvider from './context/ThemeProvider';
import MenuProvider from './context/MenuProvider';

import TransitionLayer from './components/TransitionLayer'
import Pages from './pages';

import { siteTitle } from './constants';

function App() { 
  return (
    <Providers>
      <Helmet>
        <title>{siteTitle}</title>
        <meta
            name="description"
            content="In Ha Ryu"
        />
        <meta name="og:title" content={siteTitle}/>
        <meta name="twitter:card" content="summar_large_image"/>
      </Helmet>
            
      <TransitionLayer />
      <Pages />
    </Providers>
  );
}

function Providers({children}) {
  return (
    <Router>
      <ThemeProvider>
        <PostProvider>
          <MouseTracker>
            <MenuProvider>
              {children}
            </MenuProvider>
          </MouseTracker>
        </PostProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App;
