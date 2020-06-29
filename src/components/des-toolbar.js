import { LitElement, html, css } from 'lit-element';
import { render } from 'lit-html';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import './des-update-info.js';
import './des-update-pwd.js';
import './des-app-card.js';
import './des-help-button.js';
import { menuIcon } from './des-icons.js';
import {config} from './des-config.js';
import { store } from '../store.js';

class DESToolBar extends connect(store)(LitElement) {
    static get properties() {
      return {
        name: { type: String },
        page: { type: String },
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

        .apps {
          width: 100px;
          left: 0px;
          position: absolute;
        }
        .apps-menu-content {

        }

        .profileItem {
          font-size: 10px;
          --paper-item-focused: {
              font-weight: normal;
          --paper-item-selected-weight: normal;
              };
        }

        .profileItem a,
        paper-listbox a {
          color: inherit;
          text-decoration: none;
        }
        paper-listbox paper-item:hover {
          background-color: lightgray;
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

        @media (min-width: 1001px) {

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
    _ProfileDialog(e){
      this.shadowRoot.getElementById("UpdateProfileDialog").open();
    }
    _PasswordDialog(e){
      this.shadowRoot.getElementById("ChangePasswordDialog").open();
    }
    patchOverlay(e){
      //if (e.target.withBackdrop) {
      //  e.target.parentNode.insertBefore(e.target._backdrop, e.target);
     // }
      const overlay = document.querySelector('iron-overlay-backdrop');
      //const diag = this.shadowRoot.getElementById("UpdateProfileDialog");
      e.target.parentNode.insertBefore(overlay, e.target);
      overlay.style.position = "fixed";
      overlay.style.height = "2000px";
      overlay.style.width = "3000px";
      overlay.style.left = "0px";

    }

    _closeUpdateProfileDialog(event) {
      this.shadowRoot.getElementById('UpdateProfileDialog').opened = false;
      this.shadowRoot.getElementById('ChangePasswordDialog').opened = false;
    }

    _updateProfileRenderer(root, dialog) {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
          <des-update-info @dialogClickCancel="${(e) => {this._closeUpdateProfileDialog(e)}}"></des-update-info>
        `,
        container
      )
    }

    _changePasswordRenderer(root, dialog) {
      let container = root.firstElementChild;
      if (container) {
        root.removeChild(root.childNodes[0]);
      }
      container = root.appendChild(document.createElement('div'));
      render(
        html`
          <des-update-pwd @dialogClickCancel="${(e) => {this._closeUpdateProfileDialog(e)}}"></des-update-pwd>
        `,
        container
      )
    }

    render() {
      return html`

        <vaadin-dialog id="UpdateProfileDialog" aria-label="simple"></vaadin-dialog>
        <vaadin-dialog id="ChangePasswordDialog" aria-label="simple"></vaadin-dialog>

        <app-toolbar class="toolbar-top" sticky>
          <button class="menu-btn" title="Menu" @click="${this._ClickHandler}">${menuIcon}</button>
          <div main-wide-title>DARK ENERGY SURVEY desaccess</div>
          <div main-narrow-title>DES desaccess</div>

          ${this._profile ? html`
            <div style="display: inline-block; color: white; position: absolute; right: 110px; font-size: 1rem;">${this.name}</div>
            <paper-menu-button class="profile">
              <iron-icon class="profile-icon" icon="account-circle" slot="dropdown-trigger"></iron-icon>
              <iron-icon style="margin-left:-5px;" icon="arrow-drop-down" slot="dropdown-trigger" alt="menu"></iron-icon>
              <paper-listbox class="profile-listbox" slot="dropdown-content">
                <a title="Update profile info" href="#" onclick="return false;"><paper-item class="profileItem" @click="${(e) => {this.shadowRoot.getElementById('UpdateProfileDialog').opened = true;}}">Update Profile</paper-item></a>
                <a title="Change password" href="#" onclick="return false;"><paper-item class="profileItem" @click="${(e) => {this.shadowRoot.getElementById('ChangePasswordDialog').opened = true;}}">Change Password</paper-item></a>
                <a title="Logout" href="#" onclick="return false;"><paper-item class="profileItem" @click="${ (e) => {window.location.href = config.frontEndUrl + 'logout';}}">Log out</paper-item></a>
              </paper-listbox>
            </paper-menu-button>

          ` : html``}

          ${['help', 'login', 'logout'].indexOf(this.page) === -1 ? html`
            <des-help-button></des-help-button>
          ` : html``}
        </app-toolbar>
      `;
    }

    constructor() {
      super();
      this._profile = false;
      this.page = '';
      this._updateProfileRenderer = this._updateProfileRenderer.bind(this); // need this to invoke class methods in renderers
      this._changePasswordRenderer = this._changePasswordRenderer.bind(this); // need this to invoke class methods in renderers
    }

    stateChanged(state) {
      this._profile = state.app.session;
      this.page = state.app.page;
    }

    firstUpdated() {
      this.shadowRoot.getElementById('UpdateProfileDialog').renderer = this._updateProfileRenderer;
      this.shadowRoot.getElementById('ChangePasswordDialog').renderer = this._changePasswordRenderer;
    }
  }

  window.customElements.define('des-toolbar', DESToolBar);
