import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';
import Footer from '../components/theme/Footer';
import Sidebar from '../components/theme/Sidebar';
import API from '../api/API';

// handle the private routes
function PrivateRoute({ component: Component, theme: Theme, screen: Screen, location: location, ...rest }) {

  const [isPermitted, setIsPermitted] = useState();

  useEffect(() => {
    if (getToken()) {
      if (Screen !== "home" && Screen !== "changePassword" && Screen !== "userProfile") {
        const apiRequest = { "screen": Screen }
        
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
          const isAuthorized = response.data;
          if (isAuthorized === "") {
            setIsPermitted(false);
          } else {
            setIsPermitted(true);
          }
        }).catch(error => {
          console.log("**************error.response*****************");
          console.log(error.response);
          setIsPermitted(false);
        });
      } else {
        setIsPermitted(true);
      }
    } else {
      setIsPermitted(false);
    }
  }, []);

  let ret = "";

  if (getToken()) {
    if (typeof isPermitted === 'undefined') {
      ret = <></>
    } else {
      if (isPermitted) {
        ret = <Route
          {...rest}
          render={
            (props) => getToken() ?
              <Theme
                main={Component}
                sidebar={Sidebar}
                footer={Footer}
                {...props}
              /> :
              <Redirect to={{ pathname: '/login', state: { from: location } }} />
          }
        />
      } else {
        //ret = <Redirect to={{ pathname: '/unauthorized' }} />
      }
    }
  } else {
    ret = <Redirect to={{ pathname: '/login', state: { from: location } }} />
  }

  return (
    ret
  )
}

export default PrivateRoute;