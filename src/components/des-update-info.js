import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { SharedStyles } from './styles/shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import {config} from './des-config.js';

class DESUpdateInfo extends  connect(store)(LitElement) {
    static get properties() {
      return {
        _profile: { type: Boolean },
        _name: { type: String },
        _username: { type: String },
        _lastname: { type: String },
        msg: { type: String },
        _email: { type: String },

      }
    }

    static get styles() {
      return [
      SharedStyles,
        css`

        paper-card.des-card {
          margin-top: 8px;
          width: 100%;
          --paper-card-header-color: red;
          padding: 40px;
        }
        `
      ];
    }


    _submit(){
        this.shadowRoot.getElementById("UpdateAcceptButton").disabled=true;
        this.shadowRoot.getElementById("loginSpinner").active=true;
        var token=localStorage.getItem("token");
        const Url=config.backEndUrl + "profile/update"
        const formData = new FormData();
        formData.append('username', this._username);
        formData.append('firstname', this._name);
        formData.append('lastname', this._lastname);
        formData.append('email', this._email);
      const data = new URLSearchParams(formData);
      const param = {
        body: data,
        method: "POST",
        headers: {'Authorization': 'Bearer ' + token}
      };
      fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {
      this.msg = data.message;
      const status = data.status;
        this.shadowRoot.getElementById("UpdateAcceptButton").disabled=false;
        this.shadowRoot.getElementById("loginSpinner").active=false;
        console.log(this.msg);
        if (status == 'ok') {
        this.msg = "Information Updated. Logging out in 3 seconds..."
        setTimeout(function(){  window.location.href = config.frontEndUrl + 'logout';}, 3000);

        }

    })
    .catch((error) => {console.log(error);});
  }

    render() {
      return html`
        <paper-card class="des-card" heading="Update Personal Profile" elevation="0">
        <div class="card-content">
        <span>Please enter your information</span>
        <br>
        <paper-input always-float-label label="Username" disabled placeholder=${this._username}></paper-input>
        <paper-input always-float-label label="First Name" value=${this._name} @input="${e => this._name = e.target.value}"></paper-input>
        <paper-input always-float-label label="Last Name" value=${this._lastname} @input="${e => this._lastname = e.target.value}"></paper-input>
        <paper-input always-float-label label="Email" value=${this._email} @input="${e => this._email = e.target.value}"></paper-input>
        <br>
        <br>
        <br>
        <div>
        <div class="card-actions">
        <paper-button id="UpdateAcceptButton" class="des-button" raised @click="${this._submit}">Submit</paper-button>
        <paper-button class="des-button" raised dialog-dismiss>Cancel</paper-button>
        <paper-spinner id=loginSpinner></paper-spinner>
        <br>
        <br>
        <div class="errormessage"> <b>${this.msg}</b></div>
        <br>
          </div>
        </paper-card>
      `;
    }

    constructor() {
      super();
      this._profile = false;
    }

    stateChanged(state) {
      this._profile = state.app.session;
      this._name = state.app.name;
      this._lastname = state.app.lastname;
      this._username = state.app.username;
      this._email = state.app.email;
    }
  }

  window.customElements.define('des-update-info', DESUpdateInfo);
