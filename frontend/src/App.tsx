import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInWithGoogleButton from './SignInWithGoogleButton';
import GoogleCallback from './GoogleCallback';
import FacebookCallback from './FacebookCallback';
import SignInWithFacebookButton from './SignInWithFacebookButton';
import SignUpPage from './page/SignUp';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<SignInWithGoogleButton />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        <Route path="/facebook" element={<SignInWithFacebookButton />} />
        <Route path="/auth/facebook/callback" element={<FacebookCallback />} /> */}

        {/* Sign-Up Route */}
        <Route path="/" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
