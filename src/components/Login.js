import React, { useState } from 'react';
import { setUserSession, removeUserSession } from '../utils/Common';
import API from '../api/API';
import Logo from "../images/logo.png"

const Login = ({ ...props }) => {
  const [loading, setLoading] = useState(false);
  const email = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);

    API.post('login', { email: email.value, password: password.value }).then(response => {
      setLoading(false);
      console.log("************response.data**********");
      console.log(response.data);
      const data = response.data.user;
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        common_user:data.common_user,
      }
      console.log("************user**********");
      console.log(user);
      setUserSession(response.data.access_token, user);
      props.history.push(`/home`);
      //window.location.reload();
    }).catch(error => {
      console.log("************error**********");
      console.log(error);
      setLoading(false);
      try {
        if (error.response.data.message) {
          try {
            let errors = [];
            Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
              data.forEach(error => errors.push(error));
            });
            setError(errors[0]);
          } catch (error) {
            setError(error);
          }
        }
      } catch (error) {
        setError(error);
      }
      removeUserSession();
    });
  }

  return (
    <div id="layoutAuthentication" className="bg-lighter">
      <div id="layoutAuthentication_content">
        <main>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card shadow-lg border-0 my-5 login-card">
                  <div className="card-header">
                    <a className="navbar-brand" href="#!">
                      <img className="sidenav-logo" src={Logo} alt="InQube Logo" />
                    </a>
                  </div>
                  <div className="card-body">
                    <form>
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                      <div className="form-group">
                        <label className="mb-1" htmlFor="inputEmailAddress">Username</label>
                        <input className="form-control" id="inputEmailAddress" type="email" name="email" placeholder="Enter email address" required autoFocus {...email} />
                      </div>
                      <div className="form-group">
                        <label className="mb-1" htmlFor="inputPassword">Password</label>
                        <input className="form-control" id="inputPassword" type="password" name="password" placeholder="Enter password" required {...password} />
                      </div>
                      <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                        <button className="btn common-btn" type="submit" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}>Login</button>
                      </div>
                    </form>
                  </div>
                  {/* <div className="card-footer text-center">
                    <div className="small"><a href={`${process.env.PUBLIC_URL}/register`}>Need an account? Register!</a></div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutAuthentication_footer">
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy;  C&S Solution.</div>
              <div>
                <a href="#!">Privacy Policy</a>&middot;<a href="#!">Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;