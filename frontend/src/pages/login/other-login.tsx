import faceboook from "../../images/logo_facebook.png"
import google from "../../images/logo_google.png" 

export const OtherLogin = () => {
  return (
    <div className="other-login">
      <div className="forgot-password">
        <a href="#">Forgot password</a>
      </div>
      <div className="divider">
        <p>
          <hr />
          OR
          <hr />
        </p>
      </div>

      <div className="login-with">
        <div className="login-with-facebook">
          <img src={faceboook} alt="Facebook" />
          <span>Facebook</span>
        </div>

        <div className="login-with-google">
          <img src={google} alt="Google" />
          <span>Google</span>
        </div>
      </div>

      <div className="container-create-account">
        <div className="title">Do you have an account yet?</div>
        <a href="#">Register</a>
      </div>
    </div>
  );
};
