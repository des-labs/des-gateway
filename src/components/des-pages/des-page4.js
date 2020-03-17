import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';


class DESPage4 extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _value: { type: Number },
      username: {type: String},
      query: {type: String},
      msg: {type: String},
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .test {color:  black;}
        `,
    ];
  }


 constructor(){
   super();
   this.username = '';
   this.query = '';
   this.msg = "";
}

  render() {
    return html`

      <section>
        <div>
        <h2>Submit database query</h2>
        </div>
       <div>
       name: <input value="${this.username}" @input="${e => this.name = e.target.value}">
       query: <input value="${this.query}" @input="${e => this.query = e.target.value}">
        <p>Result: ${this.name}</p>
        <button @click="${this._submit}">Submit</button>
        <p> ${this.msg}</p>
        </div>
      </section>

    `;
  }

  _submit(){
    console.log(this.username);
    const Url=config.backEndUrl + config.apiPath +  "/job/submit"
    const formData = new FormData();
    formData.append('job', 'query');
    formData.append('username', this.username);
    formData.append('query', this.query);
    const data = new URLSearchParams(formData);
    const param = {
      body: data,
      method: "PUT"
    };
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {this.msg = data.msg;})
    .catch((error) => {console.log(error);});
  }

  stateChanged(state) {
    this.username = state.app.username;
  }

}

window.customElements.define('des-page4', DESPage4);
