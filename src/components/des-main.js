/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  loadPage,
  updateDrawerState,
  updateDrawerPersist,
  loginUser,
  logoutUser,
  getProfile
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-image/iron-image.js';
import './des-toolbar.js';
import './des-sidebar.js';
import { config } from './des-config.js';

class DESMain extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _session: {type: Boolean},
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _drawerPersisted: { type: Boolean },
      username: {type: String},
      name: {type: String},
      email: {type: String},
      accessPages: {type: Array},
      _listPages: {type: Array},
      roles: {type: Array}
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #E91E63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: white;
          --app-drawer-text-color: black;
          --app-drawer-selected-color: black;
        }


        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 0px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
          font-weight: bold;
          background-color: lightgray;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 80vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 5px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        @media (min-width: 460px) {
          .main-content {
            padding-top: 107px;
            margin-left: 256px;
          }


        }
      `
    ];
  }

  render() {
    return html`
      <!-- Header -->
      <app-header fixed style="z-index: 10;">
      <des-toolbar @clickMenu=${this._menuButtonClicked}></des-toolbar>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          .persistent="${this._drawerPersisted}"
          @opened-changed="${this._drawerOpenedChanged}"
          transition-duration=0
       >
       <des-sidebar name=${this.name} email=${this.email}></des-sidebar>
        <nav class="drawer-list">
          <a ?selected="${this._page === 'home'}" href="${config.frontEndUrl + config.rootPath + '/home'}">Home</a>
          ${this.accessPages.includes('page1') ?  html`<a ?selected="${this._page === 'page1'}" href="${config.frontEndUrl + config.rootPath + '/page1'}">Page One</a>` : html ``}
          ${this.accessPages.includes('page2') ?  html`<a ?selected="${this._page === 'page2'}" href="${config.frontEndUrl + config.rootPath + '/page2'}">Page Two</a>` : html ``}
          ${this.accessPages.includes('page3') ?  html`<a ?selected="${this._page === 'page3'}" href="${config.frontEndUrl + config.rootPath + '/page3'}">Submit test job</a>` : html ``}
          ${this.accessPages.includes('db-access') ?  html`<a ?selected="${this._page === 'db-access'}" href="${config.frontEndUrl + config.rootPath + '/db-access'}">DB access</a>` : html ``}
          ${this.accessPages.includes('cutout') ?  html`<a ?selected="${this._page === 'cutout'}" href="${config.frontEndUrl + config.rootPath + '/cutout'}">Cutout</a>` : html ``}
          ${this.accessPages.includes('status') ?  html`<a ?selected="${this._page === 'status'}" href="${config.frontEndUrl + config.rootPath + '/status'}">Job status</a>` : html ``}
          ${this.accessPages.includes('ticket') ?  html`<a ?selected="${this._page === 'ticket'}" href="${config.frontEndUrl + config.rootPath + '/ticket'}">DES Ticket</a>` : html ``}
        </nav>

      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
         <des-login class="page" ?active="${this._page === 'login'}" ></des-login>
         <des-home class="page" ?active="${this._page === 'home'}"></des-home>
        ${this.accessPages.includes('page1') ?
           html`<des-page1 class="page" ?active="${this._page === 'page1'}"></des-page1>` :
           html`<des-404 class="page" ?active="${this._page === 'page1'}"></des-404>`}
        ${this.accessPages.includes('page2') ?
           html`<des-page2 class="page" ?active="${this._page === 'page2'}"></des-page2>` :
           html`<des-404 class="page" ?active="${this._page === 'page2'}"></des-404>` }
        ${this.accessPages.includes('page3') ?
           html`<des-page3 class="page" ?active="${this._page === 'page3'}"></des-page3>` :
           html`<des-404 class="page" ?active="${this._page === 'page3'}"></des-404>`}
        ${this.accessPages.includes('db-access') ?
           html`<des-db-access class="page" ?active="${this._page === 'db-access'}"></des-db-access>` :
           html`<des-404 class="page" ?active="${this._page === 'db-access'}"></des-404>`}
        ${this.accessPages.includes('cutout') ?
           html`<des-cutout class="page" ?active="${this._page === 'cutout'}"></des-cutout>` :
           html`<des-404 class="page" ?active="${this._page === 'cutout'}"></des-404>`}
        ${this.accessPages.includes('status') ?
           html`<des-job-status class="page" ?active="${this._page === 'status'}"></des-job-status>` :
           html`<des-404 class="page" ?active="${this._page === 'status'}"></des-404>`}
        ${this.accessPages.includes('ticket') ?
           html`<des-ticket class="page" ?active="${this._page === 'ticket'}"></des-ticket>` :
           html`<des-404 class="page" ?active="${this._page === 'ticket'}"></des-404>`}

        <des-404 class="page" ?active="${this._page === 'des404'}"></des-404>
      </main>


      <footer>
        <p> &copy; DESDM Team, 2020</p>
      </footer>

    `;
  }

  constructor() {
    super();
    this._session = false;
    store.dispatch(getProfile());
    this._drawerOpened="false";
    setPassiveTouchGestures(true);
  }

  stateChanged(state) {
    this._session = state.app.session;
    this._page = state.app.page;
    this._drawerOpened = state.app.drawerOpened;
    this._drawerPersisted = state.app.drawerPersisted;
    this.username = state.app.username;
    this.email = state.app.email;
    this.name = state.app.name;
    this.roles = state.app.roles;
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    installMediaQueryWatcher(`(min-width: 800px)`, (matches) => {
      matches ?  this._goWide() :  this._goNarrow()
    })
    // Attempt to refresh the auth token automatically before it expires
    let minutes = 60*1000;
    window.setInterval(() => {
      console.log('Refreshing auth token via getProfile()...');
      store.dispatch(getProfile());
    }, 5*minutes);
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
      });
    }
    if (changedProps.has('accessPages')) {
      installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname),this._drawerPersisted, this.accessPages, this._session)));
    }
  }

  _goWide(){
    store.dispatch(updateDrawerPersist(true));
    store.dispatch(updateDrawerState(true));
  }

  _goNarrow(){
    store.dispatch(updateDrawerPersist(false))
    store.dispatch(updateDrawerState(false));
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

}

window.customElements.define('des-main', DESMain);
