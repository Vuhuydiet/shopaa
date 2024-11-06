import React from 'react';

const SignInWithFacebookButton: React.FC = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/facebook';
  };

  return <button onClick={handleGoogleSignIn}>Sign in with Facebook</button>;
};

export default SignInWithFacebookButton;