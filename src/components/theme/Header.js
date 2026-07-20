import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/Common';
import { logoutUser } from '../../api/API';

const Header = () => {
    const user = getUser();
    const [toggle, setToggle] = useState(false);

    // handle click event of logout button
    const handleLogout = () => {
        logoutUser();
    }

    useEffect(() => {
        if (toggle) {
            document.body.classList.add('sb-sidenav-toggled');
        } else {
            document.body.classList.remove('sb-sidenav-toggled');
        }
    }, [toggle]);

    //sidebar toggle
    const handleSidebarToggle = e => {
        e.preventDefault();
        setToggle(!toggle);
    }

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark main-header">
            <a className="navbar-brand" href="#!">PMS</a>
            {
                user && <button className="btn btn-link btn-sm order-1 order-lg-0" onClick={handleSidebarToggle} id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            }

            <ul className="navbar-nav ml-auto mr-0 mr-md-3 my-2 my-md-0">
                {
                    user && (
                        <>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="userDropdown" href="#!" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-user fa-fw"></i>{user.name}</a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                    <a className="dropdown-item" href="#!">Settings</a><a className="dropdown-item" href="#!">Activity Log</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" onClick={handleLogout}>Logout</a>
                                </div>
                            </li>
                        </>
                    )
                }
            </ul>
        </nav>
    );
}

export default Header;