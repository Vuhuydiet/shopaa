export const FormLogin = () => {
  return (
    <div className="form-login">
      <form>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Email/Phone number"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
        />
        <input type="submit" value="Log In" />
      </form>
    </div>
  );
};
