import React, { useState } from 'react';
import API from '../api/API';
import Logo from "../images/logo.png"

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const name = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');

  // handle button click of login form
  const handleRegister = () => {
    setError(null);
    setLoading(true);

    API.post('register', { name: name.value, email: email.value, password: password.value }).then(response => {
      setLoading(false);
      setMessage(response.data.message);
    }).catch(error => {
      setLoading(false);
      setError("An Error Occured");
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
                      {message && <div className="alert alert-success" role="alert">{message}</div>}
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                      <div className="form-group">
                        <label className="small mb-1" htmlFor="inputName">Name</label>
                        <input className="form-control py-4" id="inputName" type="text" name="name" placeholder="Enter name" required autoFocus {...name} />
                      </div>
                      <div className="form-group">
                        <label className="small mb-1" htmlFor="inputEmailAddress">Email</label>
                        <input className="form-control py-4" id="inputEmailAddress" type="email" name="email" placeholder="Enter email address" required {...email} />
                      </div>
                      <div className="form-group">
                        <label className="small mb-1" htmlFor="inputPassword">Password</label>
                        <input className="form-control py-4" id="inputPassword" type="password" name="password" placeholder="Enter password" required {...password} />
                      </div>
                      <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                        <button className="btn common-btn" type="submit" value={loading ? 'Loading...' : 'Register'} onClick={handleRegister} disabled={loading}>Register</button>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center">
                    <div className="small"><a href={`${process.env.PUBLIC_URL}/login`}>Have an account? Go to Login</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutAuthentication_footer">
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

export default Register;