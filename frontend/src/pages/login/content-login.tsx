import { FormLogin } from './form-login';
import { OtherLogin } from './other-login';

export const ContentLogin = () => {
  return (
    <div className="container-form-login">
      <div className="content-login">
        <p>Log In</p>
        <FormLogin />
        <OtherLogin />
      </div>
    </div>
  );
};
