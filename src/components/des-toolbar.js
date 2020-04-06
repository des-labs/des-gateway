import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import { menuIcon } from './des-icons.js';
import {config} from './des-config.js';
import { store } from '../store.js';

class DESToolBar extends  connect(store)(LitElement) {
    static get properties() {
      return {
        _profile: { type: Boolean }
      }
    }
  
    static get styles() {
      return [
        css`
        .toolbar-top {
          background-color: black;
          font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: normal;
          font-style: normal;
          color: white;
        }

        .profileItem {
          font-size: 10px;
          --paper-item-focused: {
              font-weight: normal;
          --paper-item-selected-weight: normal;
              };
        }

        .profileItem a {
          color: inherit;
          text-decoration: none;
        }

        .profile {
          width: 100px;
          right: 20px;
          position: absolute;
        }

        .profile-listbox {
          right: 80px;
          font-size: 0.8em;
          
        }
        
        .profile-icon{
          margin-left: 30px;
          --iron-icon-width: 44px;
          --iron-icon-height: 44px;
        }

        [main-wide-title] {
          display: none;
          margin-left: 256px;
        }
        

        .menu-btn {
          background: none;
          border: none;
          fill: white;
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        @media (min-width: 460px) {

          .menu-btn {
            display: none;
          }
        
          [main-wide-title] {
            padding-right: 0px;
            display: block;
          }
          [main-narrow-title] {
            display: none;
          }
        }


        `
      ];
    }
  
    _ClickHandler(e) {
      this.dispatchEvent(new CustomEvent('clickMenu'));
    }


    render() {
      return html`
        <app-toolbar class="toolbar-top" sticky>
          <button class="menu-btn" title="Menu" @click="${this._ClickHandler}">${menuIcon}</button>
          <div main-wide-title>DARK ENERGY SURVEY desaccess</div>
          <div main-narrow-title>DES desaccess</div>

          ${this._profile ? html`
          <paper-menu-button class="profile">
            <iron-icon class="profile-icon" icon="account-circle" slot="dropdown-trigger"></iron-icon>
            <iron-icon style="margin-left:-5px;" icon="arrow-drop-down" slot="dropdown-trigger" alt="menu"></iron-icon>
        <paper-listbox class="profile-listbox" slot="dropdown-content">
          <paper-item class="profileItem"  disabled> Change Profile</paper-item>
          <paper-item class="profileItem" @click="${this._ClickHandler}" >
          <a href="${config.frontEndUrl + config.rootPath + '/logout'}">Log out</a>
        </paper-item>
        </paper-listbox>
      </paper-menu-button>

          ` : html``}


    </app-toolbar>
      `;
    }
  
    constructor() {
      super();
      this._profile = false;
    }
  
    stateChanged(state) {
      this._profile = state.app.session;
    }
  }
  
  window.customElements.define('des-toolbar', DESToolBar);