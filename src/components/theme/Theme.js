import React from "react";
import SettingsIcon from "../../images/settings-icon.svg";
import LogoutIcon from "../../images/power.svg";
import { getUser, removeUserSession } from '../../utils/Common';
import { useHistory } from 'react-router-dom';
import API from '../../api/API';

const Theme = ({ sidebar: Sidebar, main: Main, footer: Footer, }) => {

  const history = useHistory();

  // handle click event of logout button
  const handleLogout = () => {
    API.post('logout').then(response => {
      console.log("************response.data**********");
      console.log(response.data);
       
      removeUserSession();
      history.push('/login');
      //window.location.reload();
    }).catch(error => {
      console.log("************error.response**********");
      console.log(error.response);
      console.log("Log Out Error");
      removeUserSession();
      history.push('/login');
      //window.location.reload();
    });
  }


  return (
    <>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav" className="sidebar-outer-wrap">
          <Sidebar />
          <div className="sb-sidenav-footer">
            <div className="sb-sidenav-footer-innerwrap">
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/changePassword`}><i className="fas fa-custom fa-key"></i></a>
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/userProfile`}><i className="fas fa-custom fa-user-circle"></i></a>
              
              {/* <a className="nav-link" href={`${process.env.PUBLIC_URL}/home`}>
                <div className="sb-nav-link-icon settings-icon">
                  <img src={SettingsIcon} alt="settings icon" />
                </div>
                <span>Settings</span>
              </a> */}
              <a style={{ cursor: 'pointer' }}>
                <div className="nav-link">
                  <i className="fas fa-custom fa-sign-out-alt" onClick={handleLogout}></i>
                  {/* <img src={LogoutIcon} alt="logout icon" onClick={handleLogout} /> */}
                </div>
              </a>
            </div>
          </div>
        </div>
        <div id="layoutSidenav_content">
          <main>
            <Main />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Theme;
