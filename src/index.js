import 'react-app-polyfill/ie11'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import { RecoilRoot } from 'recoil'


import { fakeBackend } from './Helpers/fake-backend';

fakeBackend();

ReactDOM.render(
  <HashRouter>
    <ScrollToTop>
      <RecoilRoot>
        <App/>
      </RecoilRoot>
    </ScrollToTop>
  </HashRouter>,
  document.getElementById('root')
)
