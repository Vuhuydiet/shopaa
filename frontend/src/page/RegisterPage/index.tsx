import RegisterForm from '../../components/Register/RegisterForm';
import './SignUpPage.css';
import logo from '../../image/logo.png';
import { useState } from 'react';
import { RegisterProvider } from '../../context/RegisterContext';
import OtpForm from '../../components/Register/OtpForm';

const RegisterPage: React.FC = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleContinue = () => {
    setShowOtpForm(true);
  };
  const handleBack = () => {
    setShowOtpForm(false);
  };

  return (
    <>
      <RegisterProvider>
        <div className="signup-container">
          <div className="image-container">
            <img src={logo} alt="Description" className="logo-image" />
          </div>
          <div className="form-container">
            {showOtpForm ? (
              <OtpForm onBack={handleBack} />
            ) : (
              <RegisterForm onContinue={handleContinue} />
            )}
          </div>
        </div>
      </RegisterProvider>
    </>
  );
};

export default RegisterPage;
