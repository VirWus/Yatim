// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
//import AuthService from './Services/AuthService'
import { Redirect, Route } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { authAtom } from '../States/Atoms/auth';
import  jwt_decode  from 'jwt-decode';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  //const isLoggedIn = AuthService.isLoggedIn()
  const auth = useRecoilValue(authAtom);
  if (auth) {
    var decoded = jwt_decode(auth['token'])
     //console.log(decoded);
   
  }
  //console.log(auth)

  return (
    <Route
      {...rest}
      render={props =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
       
      }
    />
  )
}

export default PrivateRoute