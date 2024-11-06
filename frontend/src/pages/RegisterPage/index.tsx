import RegisterForm from '../../components/Register/RegisterForm';
import './SignUpPage.css';
import logo from '../../images/logo.png';
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
        <div className="Register__container">
          <div className="Register__image">
            <img
              src={logo}
              alt="Description"
              className="Register__image-logo"
            />
          </div>
          <div className="Register__form">
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
