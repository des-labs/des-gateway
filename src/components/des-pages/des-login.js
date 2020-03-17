import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { loginUser,
         logoutUser,
         navigate,
         updateDrawerPersist,
         updateDrawerState } from '../../actions/app.js';
import {config} from '../des-config.js';


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
        .loginBox {
          border: 1px solid gray;
          padding: 15px;
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
       <div class="loginBox">
        <h2>Login Page</h2>
        <paper-input always-float-label label="Username"  @input="${e => this.username = e.target.value}"></paper-input>
        <paper-input always-float-label label="Password"  type="password" @input="${e => this._passwd = e.target.value}"></paper-input>

        <paper-button id="loginButton"raised @click="${this._submit}">Submit</paper-button>
        <paper-spinner id=loginSpinner></paper-spinner>
        <p> ${this.msg}</p>
        </div>
      </section>
    `;
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
      store.dispatch(loginUser({"name": data.name, "username": data.username, "email":data.email, "session": true}));
      store.dispatch(updateDrawerState(true));
      store.dispatch(updateDrawerPersist(true));
      store.dispatch(navigate(decodeURIComponent(location.pathname) ,true,  ['page1', 'page2', 'page3', 'ticket'], true));
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
