import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useUserActions } from './Actions/users.actions'
//import { TimeAgo } from '@n1ru4l/react-time-ago'
import Clock from './components/Clock/index'
import jwt_decode from 'jwt-decode'
import { useRecoilValue } from 'recoil'
import { authAtom } from './States/Atoms/auth'

export const AppTopbar = props => {
  const userActions = useUserActions()
  const auth = useRecoilValue(authAtom)
  //console.log(auth)
  if (auth) {
    var decoded = jwt_decode(auth['token'])
   // console.log(decoded["scopes"][0]);
  }

  return (
    <div className="layout-topbar p-4 ">
      <button
        type="button"
        className="p-link  !bg-spacecadet layout-topbar-button"
        onClick={props.onToggleMenuClick}
      >
        <i className="pi pi-bars" />
      </button>

      <Link to="/" className="layout-topbar-logo">
        <span>Clinique Akhrouf</span>
      </Link>

      <Clock></Clock>

      <button
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={props.onMobileTopbarMenuClick}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul
        className={classNames('layout-topbar-menu lg:flex origin-top', {
          'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive
        })}
      >
        <li className="py-3 ">{auth.username}</li>
        <li>
          <Link to="/user" className="p-link layout-topbar-button">
            <i className="pi pi-user" />
            <span>Profile</span>
          </Link>
        </li>
       
        {decoded["scopes"][0] === "admin-tech" ? (
          <li>
            <Link to="/setting" className="p-link layout-topbar-button">
              <i className="pi pi-cog" />
              <span>Setting</span>
            </Link>
          </li>
        ) : (
          ''
        )}
        <li>
          <button
            className="p-link layout-topbar-button"
            onClick={() => userActions.logout()}
          >
            <i className="pi pi-sign-out" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
