/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {config} from '../components/des-config.js';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';
var root = config.rootPath === '/' ? '/' : config.rootPath.slice(1);
// TODO: need to fix this usage of ridx
var ridx = config.rootPath === '/' ? 0 : 1;

export const navigate = (path,persist,hp) => (dispatch) => {
  const path2 = path.slice(-1) === '/' ? path : path.concat('/');
  // TODO: fix
  const page = path2 === config.rootPath ? 'home' : path2.slice(1).split("/")[ridx];
  dispatch(loadPage(page, hp));
  persist ? '' : dispatch(updateDrawerState(false)) 
  // Close the drawer - in case the *path* change came from a link in the drawer.
  //dispatch(updateDrawerState(false));
};

const loadPage = (page,hp) => (dispatch) => {
  switch(page) {
    case 'home':
      import('../components/des-pages/des-home.js');
      break;
    case 'page1':
      hp.includes('page1') ?  import('../components/des-pages/des-page1.js') :  import('../components/des-pages/des-404.js') ;
      break;
    case 'page2':
      hp.includes('page2') ?  import('../components/des-pages/des-page2.js') : import('../components/des-pages/des-404.js')  ;
      break;
    case 'page3':
      hp.includes('page3') ?   import('../components/des-pages/des-page3.js') : import('../components/des-pages/des-404.js') ;
      break;
    default:
      page = 'des404';
      import('../components/des-pages/des-404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};


export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const updateDrawerPersist = (persisted) => {
  return {
    type: UPDATE_DRAWER_PERSIST,
    persisted
  };
};