import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { SharedStyles } from './styles/shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@cwmr/paper-password-input/paper-password-input.js'
import '@cwmr/paper-password-input/min-length-validator.js'
import '@cwmr/paper-password-input/match-passwords-validator.js'
import '@polymer/paper-spinner/paper-spinner.js';
import {config} from './des-config.js';

class DESUpdatePwd extends  connect(store)(LitElement) {
    static get properties() {
      return {
        _profile: { type: Boolean },
        _username: { type: String },
        _oldpwd: { type: String },
        _newpwd: { type: String },
        msg: { type: String },
        _db: { type: String },

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
        const Url=config.backEndUrl + "profile/changepwd"
        const formData = new FormData();
        formData.append('username', this._username);
        formData.append('oldpwd', this._oldpwd);
        formData.append('newpwd', this._newpwd);
        formData.append('db', this._db);
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
        console.log(data);
        const status = data.status;
        this.shadowRoot.getElementById("UpdateAcceptButton").disabled=false;
        this.shadowRoot.getElementById("loginSpinner").active=false;
        console.log(this.msg);
        if (status == "ok") {
          this.msg = "Password Changed. Logging out in 3 seconds..."
          setTimeout(function(){  window.location.href = config.frontEndUrl + 'logout';}, 3000);
        }

    })
    .catch((error) => {console.log(error);});
  }

    render() {
      return html`
        <min-length-validator id="min-length-validator" min-length="6"></min-length-validator>
        <match-passwords-validator id="match-passwords-validator" password=${this._newpwd}></match-passwords-validator>
        <paper-card class="des-card" heading="Change Password  for [${this._db}]"  elevation="0">
        <div class="card-content">
        <br>
        <paper-input always-float-label label="Username" disabled placeholder=${this._username}></paper-input>
        <paper-password-input
          always-float-label
          type="password"
          label="CURRENT Password"
          @input="${e => this._oldpwd = e.target.value}"
          required
          auto-validate
          error-message="Can't be empty"
          ></paper-password-input>
        <paper-password-input
          always-float-label
          type="password"
          label="NEW Password"
          @input="${e => this._newpwd = e.target.value}"
          auto-validate
           ></paper-password-input>
        <paper-password-input
        always-float-label
        type="password"
        label="Re-enter NEW Password"
        auto-validate
        validator="match-passwords-validator"
        error-message="Passwords need to match"
        ></paper-password-input>
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
        <br>
          </div>
          <br>

        <div class="errormessage"> <b>${this.msg}</b></div>
        </paper-card>
      `;
    }

    constructor() {
      super();
      this._profile = false;
    }

    stateChanged(state) {
      this._profile = state.app.session;
      this._username = state.app.username;
      this._db = state.app.db;
    }
  }

  window.customElements.define('des-update-pwd', DESUpdatePwd);
