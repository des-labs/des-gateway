import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@cwmr/paper-password-input/paper-password-input.js'
import { loginUser,
         logoutUser,
         navigate,
         updateDrawerPersist,
         updateDrawerState,
         getAccessPages } from '../../actions/app.js';
import {config, rbac_bindings} from '../des-config.js';


class DESLogin extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      username: {type: String},
      _passwd: {type: String},
      database: {type: String},
      msg: {type: String}
    };
  }
  static get styles() {
    return [
      SharedStyles,
      css`
      :host {
        height: 300px;
      }
        .loginBox {
          border: 1px solid gray;
          padding: 15px;
          width: 520px;
          min-height: 400px;
        }

        .box-watermark-logo {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          background: url('images/DESDM_logo.png');
          background-size: cover;
        }




      `
    ];
  }

  constructor() {
    super();
    this.database='dessci';
  }

  render() {
    return html`
      <section>
      <paper-card class="loginBox">
      <div style="cursor:default;" class="box-watermark-logo"></div>
        <h2>DESaccess Login</h2>
        <div class="card-content">
        <span>Use your Internal DES DB credentials. <br />
        <span> Fill this <a href='https://deslogin.wufoo.com/forms/help-me-with-my-desdm-account/' target="_blank">form</a>
             if you have trouble accessing the server</span> <br><br>


        <paper-input always-float-label label="Username"  @input="${e => this.username = e.target.value}"></paper-input>
        <paper-password-input always-float-label label="Password"  type="password" @input="${e => this._passwd = e.target.value}">
        </paper-password-input>
        <br>


        <div class="container">
        <paper-button class="des-button" id="loginButton"raised @click="${this._prep0}">dessci</paper-button>
        <paper-button class="des-button" id="loginButton"raised @click="${this._prep1}">desoper</paper-button>
        <paper-spinner id=loginSpinner></paper-spinner>
          </div>
          <br>
        <div class="errormessage"> <b>${this.msg}</b></div>
        <br>
        </div>
            <div class="card-content"><a href="https://deslogin.wufoo.com/forms/help-me-with-my-desdm-account/" style="font-size: 11px; margin-left: 5px;" target="_blank"> Forgot Password? </a>
            </div>
      </div>

        </div>
      </paper-card>
      </section>
    `;
  }


_prep0(){
  this.database='dessci';
  this._submit();
}

_prep1(){
  this.database='desoper';
  this._submit();
}

_submit(){
  // do request
  this.shadowRoot.getElementById("loginButton").disabled=true;
  this.shadowRoot.getElementById("loginSpinner").active=true;
  const Url=config.backEndUrl + config.apiPath +  "/login"
  const formData = new FormData();
  formData.append('username', this.username);
  formData.append('password', this._passwd);
  formData.append('database', this.database);
  const data = new URLSearchParams(formData);
  const param = {body: data, method: "POST"};
  fetch(Url, param)
  .then(response => {
    return response.json();
  })
  .then(data => {
    if (data.status == 'ok'){
      localStorage.setItem("token", data.token);
      store.dispatch(loginUser({"name": data.name, "username": data.username,
      "lastname": data.lastname, "email":data.email, "session": true, "db": data.db, "roles": data.roles}));
      store.dispatch(navigate(decodeURIComponent(window.location.pathname.replace(/\/+$/, '')) ,true, getAccessPages(data.roles), true));
    }
    else {
      localStorage.clear();
      store.dispatch(logoutUser());
      this.msg = data.message;
      this.shadowRoot.getElementById("loginButton").disabled=false;
      this.shadowRoot.getElementById("loginSpinner").active=false;

    }
  })
  .catch((error) => {console.log(error);});
}


}

window.customElements.define('des-login',DESLogin);
