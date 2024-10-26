import React from 'react';

const SignInWithGoogleButton: React.FC = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default SignInWithGoogleButton;