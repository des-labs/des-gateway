import {config, rbac_bindings} from '../components/des-config.js';
import { store } from '../store.js';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_JOB_ID = 'UPDATE_JOB_ID';
export const UPDATE_LAST_VALID_PAGE = 'UPDATE_LAST_VALID_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_DRAWER_PERSIST = 'UPDATE_DRAWER_PERSIST';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_QUERY = 'UPDATE_QUERY';

// TODO: double request to /profile
const isauth = () => {
  const token = localStorage.getItem("token");
  if (token === null){
    return false;
  }
  const Url=config.backEndUrl + "profile";
  const formData = new FormData();
  formData.append('token', token);
  const data = new URLSearchParams(formData);
  const param = { body:data, method: "POST"};
  return fetch(Url, param).then(resp => resp.json())
    .then(function(data){
      if (data.status=='ok') {
        localStorage.setItem("token", data.new_token);
        return true;
      }
      else {return false;}
    })
};

export const navigate = (path,persist,ap,session) => (dispatch) => {
  // Strip preceding and trailing slashes from root path and location.pathname
  // so that path and basePath are in general of the form `blah/blah` where only one slash
  // separates each word and there are no surrounding slashes
  let iterstr = null;
  let basePath = config.rootPath;
  while(basePath !== iterstr) {
    basePath = basePath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
    iterstr = basePath.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  }
  iterstr = null;
  while(path !== iterstr) {
    path = path.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
    iterstr = path.replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  }

  // discard the root path from the location.pathname so that pathnames like
  // `/desaccess/alpha/beta` become `alpha/beta`
  path = path.substring(path.search(basePath)+basePath.length).replace(/\/\//g, '/').replace(/\/+$/, '').replace(/^\/+/, '');
  var targetPath = path;
  // pathParts should have no zero-length strings because of the slash reduction above
  var pathParts = path.split('/');
  var basePathParts = basePath.split('/');
  // is the session active, if not verify auth
  const auth = session ? true : isauth();
  if (auth === false) {
    // dispatch(storeTargetPath(path));
    dispatch(loadPage('login', ap, targetPath));
    return;
  }
  var page = pathParts[0];
  switch (page) {
    case '':
    case 'login':
      page = 'home';
      targetPath = ''
      break;
    case 'status':
      // Highlight specific job in status if provided in URL {{location.origin}}/status/dkdh9s84ty3thj3wehg3
      if (pathParts.length > 1) {
        let jobId = pathParts[1];
        dispatch(setJobId(jobId));
      }
      break;
    default:
      break;
  }

  dispatch(loadPage(page, ap, targetPath));
  persist ? '' : dispatch(updateDrawerState(false));
};

export const loadPage = (page,ap,targetPath = '') => (dispatch) => {
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
        window.location.href = config.frontEndUrl + 'login';
      break;
    case 'home':
      import('../components/des-pages/des-home.js');
      break;
    case 'test-job':
      ap.includes('test-job') ?   import('../components/des-pages/des-test-job.js') : import('../components/des-pages/des-404.js') ;
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
    case 'help':
      import('../components/des-pages/des-help.js');
      break;
    default:
      page = 'des404';
      import('../components/des-pages/des-404.js');
  }
  if (['login', 'des404'].indexOf(page) === -1) {
    dispatch(updateDrawerState(window.innerWidth >= 1001));
    dispatch(updateDrawerPersist(window.innerWidth >= 1001));
    dispatch(updateLastValidPage(page));
  }
  let newLocation = config.frontEndUrl + targetPath;
  let currentLocation = window.location.origin+window.location.pathname;
  console.log(`currentLocation: ${currentLocation}\nnewLocation: ${newLocation}`);
  if (newLocation !== currentLocation) {
    history.pushState({}, '', newLocation);
  }
  dispatch(updatePage(page));
};

const updateLastValidPage = (page) => {
  return {
    type: UPDATE_LAST_VALID_PAGE,
    page
  };
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

export const updateQuery = (query) => {
  return {
    type: UPDATE_QUERY,
    query
  };
};

export const setJobId = (jobId) => {
  return {
    type: UPDATE_JOB_ID,
    jobId
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
  return {
    type: LOGOUT_USER,
  };
};

export const getProfile = () => {
  return dispatch => {
      const token = localStorage.getItem("token");
      if (token) {
        const Url=config.backEndUrl + "profile";
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
            if (data.status == 'ok') {
              dispatch(loginUser({"username":data.username, "lastname": data.lastname, "email": data.email,
              "name": data.name, "session": true, "db": data.db, "roles": data.roles}));
              localStorage.setItem("token", data.new_token);
              return true;
            }
            else {
              dispatch(loadPage('logout', ''));
              return false;
            }
          });
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
