import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';


class DESPage3 extends PageViewElement {
  static get properties() {
    return {
      // This is the data from the store.
      _clicks: { type: Number },
      _value: { type: Number },
      name: {type: String},
      time: {type: Number},
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
   this.name = "Peter";
   this.time = 30;
   this.msg = "";
}

  render() {
    return html`

      <section>
        <div>
        <h2>Hidden!</h2>
        </div>
       <div>
       name: <input value="${this.name}" @input="${e => this.name = e.target.value}">
       time: <input value="${this.time}" @input="${e => this.time = e.target.value}">
        <p>Result: ${this.name}</p>
        <button @click="${this._submit}">Submit</button>
        <p> ${this.msg}</p>
        </div>
      </section>

    `;
  }

  _submit(){
    console.log(this.name);
    const Url=config.backEndUrl +  "/job/submit"
    const formData = new FormData();
    formData.append('job', 'test');
    formData.append('username', this.name);
    formData.append('time', this.time);
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
  
}

window.customElements.define('des-page3', DESPage3);
