/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';

export const navigate = (path,persist,hp) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'page1' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page, hp));
  persist ? '' : dispatch(updateDrawerState(false)) 
  // Close the drawer - in case the *path* change came from a link in the drawer.
  //dispatch(updateDrawerState(false));
};

const loadPage = (page,hp) => (dispatch) => {
  switch(page) {
    case 'page1':
      hp.includes('page1') ?  import('../components/des-404.js') : import('../components/des-pages/des-page1.js');
      break;
    case 'page2':
      hp.includes('page2') ?  import('../components/des-404.js') : import('../components/des-pages/des-page2.js');
      break;
    case 'page3':
      hp.includes('page3') ?  import('../components/des-404.js') : import('../components/des-pages/des-page3.js');
      break;
      case 'ticket':
        hp.includes('ticket') ?  import('../components/des-404.js') : import('../components/des-pages/des-ticket.js');
        break;
    default:
      page = 'des404';
      import('../components/des-404.js');
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