import React from 'react';
const Unauthorized = ({ ...props }) => {

  return (
    <div id="layoutAuthentication" className="bg-lighter">
      <div id="layoutAuthentication_content">
        <main>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-6">
                <div class="text-center mt-4">
                  <h1 class="display-1">401</h1>
                  <p class="lead">Unauthorized</p>
                  <p>Access to this resource is denied.</p>
                  <a href={`${process.env.PUBLIC_URL}/home`}><i class="fas fa-arrow-left mr-1"></i>Return to Home Page</a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutAuthentication_footer">
        <footer className="py-3 bg-light mt-auto main-footer">
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

export default Unauthorized;