/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  UPDATE_PAGE,
  UPDATE_JOB_ID,
  UPDATE_LAST_VALID_PAGE,
  UPDATE_DRAWER_STATE,
  UPDATE_DRAWER_PERSIST,
  UPDATE_QUERY,
  LOGIN_USER,
  LOGOUT_USER
} from '../actions/app.js';

const INITIAL_STATE = {
  page: '',
  lastValidPage: '',
  username: '',
  email: '',
  name: '',
  db: '',
  lastname: '',
  jobId: '',
  query: '',
  roles: [],
  accessPages: [],
  session: false,
  drawerOpened: false,
  drawerPersisted: false
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        username: action.username,
        session: action.session,
        name: action.name,
        db: action.db,
        lastname: action.lastname,
        email: action.email,
        roles: action.roles,
        accessPages: action.accessPages
      };
    case LOGOUT_USER:
      return {
        ...state,
        username: '',
        name: '',
        lastname: '',
        db: '',
        session: false,
        email: '',
        roles: [],
        accessPages: []
      };
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case UPDATE_JOB_ID:
      return {
        ...state,
        jobId: action.jobId
      };
    case UPDATE_LAST_VALID_PAGE:
      return {
        ...state,
        lastValidPage: action.page
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case UPDATE_DRAWER_PERSIST:
      return {
        ...state,
        drawerPersisted: action.persisted
      };
    case UPDATE_QUERY:
      return {
        ...state,
        query: action.query
      };
    default:
      return state;
  }
};

export default app;
