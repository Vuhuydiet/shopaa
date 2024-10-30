import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import GoogleCallback from './GoogleCallback';
import FacebookCallback from './FacebookCallback';
import SignInWithFacebookButton from './SignInWithFacebookButton';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignInWithGoogleButton />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
        </Routes>
      </Router>
      <Router>
        <Routes>
          <Route path="/" element={<SignInWithFacebookButton />} />
          <Route
            path="/auth/facebook/callback"
            element={<FacebookCallback />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
