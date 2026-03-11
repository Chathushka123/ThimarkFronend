import React from 'react';

const Header = () => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand" href="#!">PMS</a>
            <form className="form-inline my-2 my-lg-0 ml-auto">
                <a className="btn btn-outline-primary btn-sm my-2 my-sm-1 mr-2" href={`${process.env.PUBLIC_URL}/login`}>Login</a>
                <a className="btn btn-outline-primary btn-sm my-2 my-sm-1" href={`${process.env.PUBLIC_URL}/register`}>Register</a>
            </form>
        </nav>
    );
}

export default Header;