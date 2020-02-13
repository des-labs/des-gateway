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
  updateDrawerState,
  updateDrawerPersist
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-image/iron-image.js';
import './des-toolbar.js';
import './des-sidebar.js';

class DESMain extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _drawerPersisted: { type: Boolean },
      name: {type: String},
      email: {type: String},
      _hiddenPages: {type: Array},
      _listPages: {type: Array}
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

        .info-container {
          position: relative;
          border: 2px solid #ccc;
          border-radius: 50%;
          height: 90px;
          padding: 2px;
          width: 90px;
          margin: 20px auto;
      }
      .info-container .image {
          background-image: url('images/user.png');
          background-size: contain;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-position: center;
      }
      .self-info {
          margin: 0 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #CCC;
          text-align: center;
      }
      .self-info .name {
          font-weight: bold;
      }
      .self-info .email {
          color: #999;
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
          min-height: 100vh;
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
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header fixed>
      <des-toolbar @clickMenu=${this._menuButtonClicked}></des-toolbar>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          .persistent="${this._drawerPersisted}"
          @opened-changed="${this._drawerOpenedChanged}"
          >
        <app-toolbar style="background-color: black;">
        <iron-image
        style="width:60px; height:60px;"
        sizing="cover"
        src="images/DESDM_logo.png"></iron-image>
        </app-toolbar>

        <div class="info-container">
                    <div class="image"></div>
                </div>
                <div class="self-info">
                    <div class="name">${this.name}</div>
                    <div class="email">${this.email}</div>
                </div>
        <br>
        <nav class="drawer-list">
          ${this._hiddenPages.includes('page1') ? html`` : html`<a ?selected="${this._page === 'page1'}" href="/page1">Page One</a>`}
          ${this._hiddenPages.includes('page2') ? html`` : html`<a ?selected="${this._page === 'page2'}" href="/page2">Page Two</a>`}
          ${this._hiddenPages.includes('page3') ? html`` : html`<a ?selected="${this._page === 'page3'}" href="/page3">Page Three</a>`}
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        ${this._hiddenPages.includes('page1') ? 
           html`<des-404 class="page" ?active="${this._page === 'page1'}"></des-404>` : 
           html`<des-page1 class="page" ?active="${this._page === 'page1'}"></des-page1>`}
        ${this._hiddenPages.includes('page2') ? 
           html`<des-404 class="page" ?active="${this._page === 'page2'}"></des-404>` : 
           html`<des-page2 class="page" ?active="${this._page === 'page2'}"></des-page2>`}
        ${this._hiddenPages.includes('page3') ? 
           html`<des-404 class="page" ?active="${this._page === 'page3'}"></des-404>` : 
           html`<des-page3 class="page" ?active="${this._page === 'page3'}"></des-page3>`}
        
        <des-404 class="page" ?active="${this._page === 'des404'}"></des-404>
      </main>

      <footer>
        <p>DESDM Team</p>
      </footer>

    `;
  }

  constructor() {
    super();
    this.name = "Matias";
    this.email = "mcarras2@illinois.edu"
    this._hiddenPages = [];
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname),this._drawerPersisted, this._hiddenPages)));
    installMediaQueryWatcher(`(min-width: 460px)`, (matches) => {
        matches ?  this._goWide() :  this._goNarrow()
      })
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
      });
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

  stateChanged(state) {
    this._page = state.app.page;
    this._drawerOpened = state.app.drawerOpened;
    this._drawerPersisted = state.app.drawerPersisted;
  }
}

window.customElements.define('des-main', DESMain);
