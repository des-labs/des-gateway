import { LitElement } from 'lit-element';

export class PageViewElement extends LitElement {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }

  static get properties() {
    return {
      active: { type: Boolean },
      username: {type: String},
      validEmail: {type: Boolean},
      email: {type: String},
      customJobName: {type: String}
    }
  }

  _validateEmail(emailStr){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailStr).toLowerCase());
  }

  _updateEmailOption(event) {
    this.shadowRoot.getElementById('custom-email').disabled = !event.target.checked;
    this.validEmail = this._validateEmail(this.email);
  }
  constructor(){
    super();
    this.username = '';
    this.email = '';
    this.validEmail = false;
    this.customJobName = '';
  }

}
