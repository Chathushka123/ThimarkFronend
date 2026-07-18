import React from "react";
import SettingsIcon from "../../images/settings-icon.svg";
import LogoutIcon from "../../images/power.svg";
import { logoutUser } from '../../api/API';

const Theme = ({ sidebar: Sidebar, main: Main, footer: Footer, }) => {

  // handle click event of logout button
  const handleLogout = () => {
    logoutUser();
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
