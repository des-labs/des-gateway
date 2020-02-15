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
   this.msg = "";
}

  render() {
    return html`

      <section>
        <div>
        <h2>Hidden!</h2>
        </div>
       <div>
       <input value="${this.name}" @input="${e => this.name = e.target.value}">
        <p>Result: ${this.name}</p>
        <button @click="${this._submit}">Submit</button>
        <p> ${this.msg}</p>
        </div>
      </section>

    `;
  }

  _submit(){
    console.log(this.name);
    const Url=config.backEndUrl +  "/test/"
    const dataP={
      name: this.name,
    };
    const param = {
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(dataP),
      method: "POST"
    };
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {this.msg = data.msg;})
    .catch((error) => {console.log(error);});
  }
  
}

window.customElements.define('des-page3', DESPage3);
