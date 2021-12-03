import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import PostProvider from './context/PostProvider';
import MouseTracker from './context/MouseTracker';

import Home from './pages/home';

function App() { 
  return (
    <Router>
      <PostProvider>
        <MouseTracker>
          <Home></Home>
        </MouseTracker>
      </PostProvider>
    </Router>
  );
}

export default App;
