import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { loginUser,
         navigate,
         updateDrawerPersist,
         updateDrawerState } from '../../actions/app.js';
import {config} from '../des-config.js';


class DESLogin extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      username: {type: String},
    };
  }
  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    return html`
      <section>
        <h2>Login Page</h2>
       <div>
        username: <input placeholder="username" @input="${e => this.username = e.target.value}">
        <button @click="${this._submit}">Submit</button>
        <p> ${this.msg}</p>
        </div>
      </section>
    `;
  }

_submit(){
  // do request
  const Url=config.backEndUrl +  "/login"
  const formData = new FormData();
  formData.append('username', this.username);
  const data = new URLSearchParams(formData);
  const param = {body: data, method: "POST"};
  fetch(Url, param)
  .then(response => {return response.json();})
  .then(data => {
    localStorage.setItem("token", data.token);
    store.dispatch(loginUser({"username": data.username, "email":data.email, "session": true}));
    store.dispatch(updateDrawerState(true));
    store.dispatch(updateDrawerPersist(true));
    store.dispatch(navigate(decodeURIComponent(location.pathname) ,true,  ['page1', 'page2', 'page3'], true));
  })
  .catch((error) => {console.log(error);});
}


}

window.customElements.define('des-login',DESLogin);
