import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import PostProvider from './context/PostProvider';
import MouseTracker from './context/MouseTracker';
import ThemeProvider from './context/ThemeProvider';

import Pages from './pages';

import { siteTitle } from './constants';

function App() { 
  return (
    <Router>
      <ThemeProvider>
        <PostProvider>
          <MouseTracker>
            <Helmet>
              <title>{siteTitle}</title>
              <meta
                  name="description"
                  content="In Ha Ryu"
              />
              <meta name="og:title" content={siteTitle}/>
              <meta name="twitter:card" content="summar_large_image"/>
            </Helmet>
            <Pages />
          </MouseTracker>
        </PostProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
