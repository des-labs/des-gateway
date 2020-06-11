import {config, rbac_bindings} from '../components/des-config.js';
import { store } from '../store.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
// var root = config.rootPath === '/' || config.rootPath === '' ? '/' : config.rootPath.slice(1);
// TODO: need to fix this usage of ridx
// var ridx = config.rootPath === '/' || config.rootPath === '' ? 0 : 1;

// TODO: double request to /profile
const isauth = () => {
  console.log('is auth?');
  const token = localStorage.getItem("token");
  if (token === null){
    console.log('no: no token');
    return false;
  }
  const Url=config.backEndUrl + config.apiPath +  "/profile";
  const formData = new FormData();
  formData.append('token', token);
  const data = new URLSearchParams(formData);
  const param = { body:data, method: "POST"};
  return fetch(Url, param).then(resp => resp.json())
                .then(function(data){
                  if (data.status=='ok') {
                    console.log('Updating token via isauth()...');
                    localStorage.setItem("token", data.new_token);
                    return true;
                  }
                  else {return false;}
                })
};

export const navigate = (path,persist,ap,session) => (dispatch) => {
  // is the session active, if not verify auth
  const auth = session ? true : isauth();
  if (auth === false) {
    dispatch(loadPage('login', ap));
    return;
  }
  var pathParts = path.replace(/\/+$/, '').split('/');
  var page = 'home';

  if (!((pathParts.length === 1 && pathParts[0] === '') || (pathParts.length > 1 && pathParts[1] === config.rootPath))) {
    page = pathParts.splice(-1)[0];
    if (page === 'login') {
      page = 'home';
    }
  }
  dispatch(loadPage(page, ap));
  persist ? '' : dispatch(updateDrawerState(false));
  // Close the drawer - in case the *path* change came from a link in the drawer.
  //dispatch(updateDrawerState(false));
};

export const loadPage = (page,ap) => (dispatch) => {
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
        window.location.href = config.frontEndUrl + config.rootPath+'/login';
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
    case 'db-access':
      ap.includes('db-access') ?   import('../components/des-pages/des-db-access.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'cutout':
      ap.includes('cutout') ?   import('../components/des-pages/des-cutout.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'status':
      ap.includes('status') ?   import('../components/des-pages/des-job-status.js') : import('../components/des-pages/des-404.js') ;
      break;
    case 'ticket':
      ap.includes('ticket') ?   import('../components/des-pages/des-ticket.js') : import('../components/des-pages/des-404.js') ;
      break;
    default:
      page = 'des404';
      import('../components/des-pages/des-404.js');
  }
  history.pushState({}, '', location.origin + '/' + page)
  // console.log('pushing state: ' + location.origin + '/' + page)
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
    db: userObj.db,
    lastname: userObj.lastname,
    session: userObj.session,
    roles: userObj.roles,
    accessPages: getAccessPages(userObj.roles)
  };
};

export const logoutUser = () => {
  console.log('logging out...');
  return {
    type: LOGOUT_USER,
  };
};

export const getProfile = () => {
  console.log('getting profile...');
  return dispatch => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log('Have token. Fetch /profile...');
        const Url=config.backEndUrl + config.apiPath +  "/profile";
        const formData = new FormData();
        formData.append('token', token);
        const data = new URLSearchParams(formData);
        const param = {
          body:data,
          method: "POST",
          headers: {'Authorization': 'Bearer ' + token}
        };
        return fetch(Url, param).then(resp => resp.json())
          .then(data => {
            console.log(data);
            if (data.status == 'ok') {
              console.log('Profile fetched. loginUser...');
              dispatch(loginUser({"username":data.username, "lastname": data.lastname, "email": data.email,
              "name": data.name, "session": true, "db": data.db, "roles": data.roles}));
              console.log('Updating token via getProfile()...');
              localStorage.setItem("token", data.new_token);
              dispatch(updateDrawerPersist(true));
              dispatch(updateDrawerState(true));
              return true;
            }
            else {
              dispatch(loadPage('logout', ''));
              return false;
            }
          });
      }
      else {
        console.log('no token');
      }

  }

};

export const getAccessPages = (roles) => {
  var ap = []
  for (var i=0; i < rbac_bindings.length; i++) {
    if (roles.indexOf(rbac_bindings[i]["role_name"]) !== -1) {
      var pages = rbac_bindings[i]["pages"]
      for (var j=0; j < pages.length; j++) {
        var page = pages[j]
        if (ap.indexOf(page) === -1) {
          ap.push(page)
        }
      }
    }
  }
  return ap
};
