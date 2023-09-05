
import React, { useState, useMemo, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AppTopbar } from './AppTopbar'
import { AppMenu } from './AppMenu'
import { Tooltip } from 'primereact/tooltip'

import { authAtom } from '_state';
import { useUserActions } from '_actions';

export { Navbar };

function Navbar() {
    const auth = useRecoilValue(authAtom);
    const userActions = useUserActions();
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false)
    const onToggleMenuClick = event => {
        menuClick = true
    
        if (isDesktop()) {
          if (layoutMode === 'overlay') {
            if (mobileMenuActive === true) {
              setOverlayMenuActive(true)
            }
    
            setOverlayMenuActive(prevState => !prevState)
            setMobileMenuActive(false)
          } else if (layoutMode === 'static') {
            setStaticMenuInactive(prevState => !prevState)
          }
        } else {
          setMobileMenuActive(prevState => !prevState)
        }
    
        event.preventDefault()
      }
    
      const onSidebarClick = () => {
        menuClick = true
      }
    
      const onMobileTopbarMenuClick = event => {
        mobileTopbarMenuClick = true
    
        setMobileTopbarMenuActive(prevState => !prevState)
        event.preventDefault()
      }
    
      const onMobileSubTopbarMenuClick = event => {
        mobileTopbarMenuClick = true
    
        event.preventDefault()
      }
    
      const onMenuItemClick = event => {
        if (!event.item.items) {
          setOverlayMenuActive(false)
          setMobileMenuActive(false)
        }
      }
    // only show nav when logged in
    if (!auth) return null;
    
    return (
           <>
            <Tooltip
    ref={copyTooltipRef}
    target=".block-action-copy"
    position="bottom"
    content="Copied to clipboard"
    event="focus"
  />

  <AppTopbar
    onToggleMenuClick={onToggleMenuClick}
    layoutColorMode={layoutColorMode}
    mobileTopbarMenuActive={mobileTopbarMenuActive}
    onMobileTopbarMenuClick={onMobileTopbarMenuClick}
    onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
  />

  <div className="layout-sidebar" onClick={onSidebarClick}>
    <AppMenu
      model={menu}
      onMenuItemClick={onMenuItemClick}
      layoutColorMode={layoutColorMode}
    />
  </div>
           </>
   

    );
}