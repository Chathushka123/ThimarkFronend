import React from "react";
import SettingsIcon from "../../images/settings-icon.svg";
import LogoutIcon from "../../images/power.svg";
import { logoutUser } from '../../api/API';
import useIsMobile from '../../utils/useIsMobile';

const Theme = ({ sidebar: Sidebar, main: Main, footer: Footer, location }) => {

  const isMobile = useIsMobile();
  const showSidebar = !isMobile;
  const isHomePage = location && location.pathname === '/home';

  // handle click event of logout button
  const handleLogout = () => {
    logoutUser();
  }


  return (
    <>
      {isMobile && !isHomePage && (
        <a
          href={`${process.env.PUBLIC_URL}/home`}
          aria-label="Go to home"
          style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050,
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#638ad6', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)', fontSize: '20px', textDecoration: 'none'
          }}
        >
          <i className="fas fa-home"></i>
        </a>
      )}
      <div id="layoutSidenav">
        {showSidebar && (
          <div id="layoutSidenav_nav" className="sidebar-outer-wrap">
            <Sidebar />
            <div className="sb-sidenav-footer">
              <div className="sb-sidenav-footer-innerwrap">
                <a className="nav-link" href={`${process.env.PUBLIC_URL}/changePassword`} title="Change Password"><i className="fas fa-custom fa-key"></i></a>
                <a className="nav-link" href={`${process.env.PUBLIC_URL}/userProfile`} title="My Profile"><i className="fas fa-custom fa-user-circle"></i></a>

                {/* <a className="nav-link" href={`${process.env.PUBLIC_URL}/home`}>
                  <div className="sb-nav-link-icon settings-icon">
                    <img src={SettingsIcon} alt="settings icon" />
                  </div>
                  <span>Settings</span>
                </a> */}
                <a style={{ cursor: 'pointer' }} title="Logout" onClick={handleLogout}>
                  <div className="nav-link">
                    <i className="fas fa-custom fa-sign-out-alt"></i>
                    {/* <img src={LogoutIcon} alt="logout icon" onClick={handleLogout} /> */}
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
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
