import {config} from '../components/des-config.js';
import { store } from '../store.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
var root = config.rootPath === '/' ? '/' : config.rootPath.slice(1);
// TODO: need to fix this usage of ridx
var ridx = config.rootPath === '/' ? 0 : 1;

// TODO: double request to /profile
const isauth = () => {
  console.log('is auth?')
  const token = localStorage.getItem("token");
  if (token === null){
    return false;
  }
  const Url=config.backEndUrl + config.apiPath +  "/profile";
  const formData = new FormData();
  formData.append('token', token);
  const data = new URLSearchParams(formData);
  const param = { body:data, method: "POST"};
  return fetch(Url, param).then(resp => resp.json())
                .then(function(data){
                  return true;
                })
};

export const navigate = (path,persist,ap,session) => (dispatch) => {
  // is the session active, if not verify auth
  const auth = session ? true : isauth();
  //console.log('auth', auth);
  const path2 = path.slice(-1) === '/' ? path : path.concat('/');
  // TODO: fix
  const page0 = path2 === config.rootPath ? 'home' : path2.slice(1).split("/")[ridx];
  // Auth
  // in case there is no auth and request page is other than login, after /login --> home
  // but after /page3 --? page3
  const temp = page0 === 'login' ? 'home' : page0;
  // page is the final page, if no auth it should go to login
  const page = auth ? temp : 'login';
  dispatch(loadPage(page, ap));
  persist ? '' : dispatch(updateDrawerState(false))
  // Close the drawer - in case the *path* change came from a link in the drawer.
  //dispatch(updateDrawerState(false));
};

const loadPage = (page,ap) => (dispatch) => {
  switch(page) {
    case 'login':
      import('../components/des-pages/des-login.js').then((module) => {
        dispatch(updateDrawerState(false));
        dispatch(updateDrawerPersist(false));
        });
      break;
    case 'logout':
         localStorage.clear();
         dispatch(logoutUser());
        window.location.href = config.rootPath+'/login';
      break;
    case 'home':
      import('../components/des-pages/des-home.js');
      break;
    case 'page1':
      ap.includes('page1') ?  import('../components/des-pages/des-page1.js') :  import('../components/des-pages/des-404.js') ;
      break;
    case 'page2':
      ap.includes('page2') ?  import('../components/des-pages/des-page2.js') : import('../components/des-pages/des-404.js')  ;
      break;
    case 'page3':
      ap.includes('page3') ?   import('../components/des-pages/des-page3.js') : import('../components/des-pages/des-404.js') ;
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

export const loginUser = (userObj) => {
  console.log('logging in...', userObj.username);
  return {
    type: LOGIN_USER,
    username: userObj.username,
    email: userObj.email,
    name: userObj.name,
    session: userObj.session
  };
};

export const logoutUser = () => {
  console.log('logging out...');
  return {
    type: LOGOUT_USER,
  };
};

export const getProfile = () => {
  console.log('getting profile');
  return dispatch => {
      const token = localStorage.getItem("token");
      const Url=config.backEndUrl + config.apiPath +  "/profile";
      const formData = new FormData();
      formData.append('token', token);
      const data = new URLSearchParams(formData);
      const param = { body:data, method: "POST"};
      if (token) {
        return fetch(Url, param).then(resp => resp.json())
                .then(data => {
                     dispatch(loginUser({"username":data.username, "email": data.email,
                     "name": data.name, "session": true}));
                     dispatch(updateDrawerPersist(true));
                     dispatch(updateDrawerState(true));
                     return true;
                     //import('../components/des-pages/des-home.js');
                     //dispatch(updatePage('home'));
                })
      }
      else {
        console.log('no token');
         //import('../components/des-pages/des-login.js').then((module) => {
        //dispatch(updateDrawerState(false));
        //dispatch(updateDrawerPersist(false));
        //});
        //dispatch(updatePage('login'));
        //window.location.href = config.rootPath+'/login';
        //dispatch(loadPage('login', ['home']));

      }

  }

};
