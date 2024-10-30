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
          <img src="../../../public/images/logo_facebook.jpg" alt="Facebook" />
          <span>Facebook</span>
        </div>

        <div className="login-with-google">
          <img src="../../../public/images/logo_google.jpg" alt="Google" />
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
