import SignUp from '../../components/SignUp';
import './SignUpPage.css';
import logo from '../../image/logo.png';

const SignUpPage: React.FC = () => {
  return (
    <>
      <div className="signup-container">
        <div className="image-container">
          <img src={logo} alt="Description" className="logo-image" />
        </div>
        <div className="form-container">
          <SignUp />
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
