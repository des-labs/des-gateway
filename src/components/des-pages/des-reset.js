import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import {config} from '../des-config.js';
import { validatePassword } from '../utils.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';

class DESReset extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      resetPasswordToken: {type: String},
      errorMsg: {type: String},
      resetComplete: {type: Boolean},
    };
  }
  static get styles() {
    return [
      SharedStyles,
      css`
      `
    ];
  }

  constructor() {
    super();
    this.resetPasswordToken = '';
    this.resetComplete = false;
    this.resetSuccess = false;
    this.errorMsg = '';
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          <iron-icon icon="vaadin:clipboard-text" style="margin-right: 1rem;"></iron-icon>
          DESaccess Password Reset
          <paper-spinner class="big"></paper-spinner>
        </div>
        ${this.resetComplete ? html`
          ${this.resetSuccess ? html`
            <p>Your password has been reset. You may proceed to the <a href="${config.frontEndUrl + "login"}">login page</a>.</p>
            ` : html`
            <p>There was an error resetting your password. Reload the page to try again.</p>
            `
          }
          ` : html`
          <div style="margin: 1rem; color: red; height: 2rem;">
            <span id="invalid-form-warning"></span>
          </div>
          <div style="max-height: 70vh; overflow: auto; padding: 1rem; border: 1px lightgray solid;">
            <p>Password must be between 10 and 30 characters long, containing only digits and uppercase and lowercase letters, starting with a letter.</p>
            <paper-input name="password"  label="Password" required type="password" value=""     @change="${e => this.password = e.target.value}"></paper-input>
            <paper-input name="password-confirm"  label="Confirm password" required type="password" value=""     @change="${e => this.passwordConfirm = e.target.value}"></paper-input>
            
            <div style="text-align: center; margin: 1rem;">
              <paper-button  name="submit-button" class="indigo" @click="${(e) => {this._resetPassword(e);}}" raised disabled>Reset Password</paper-button>
            </div>
          </div>
          `
        }
      </section>
      <paper-toast name="reset-fail" class="toast-position toast-error" text="Error: ${this.errorMsg}" duration="10000"></paper-toast>
    `;
  }

  stateChanged(state) {
    this.resetPasswordToken = state.app.resetPasswordToken;
  }

  firstUpdated() {
    // Attach an event listener to validate the form when any input field is being updated
    // so that the Submit button is enabled as soon as the user completes their inputs
    let validateWatcher = (event) => {
      this._validateForm();
    };
    let passwordInput = this.shadowRoot.querySelector('paper-input[name="password"]');
    let passwordConfirmInput = this.shadowRoot.querySelector('paper-input[name="password-confirm"]');
    passwordInput.addEventListener('keyup', validateWatcher);
    passwordConfirmInput.addEventListener('keyup', validateWatcher);
  }

  _validateForm() {
    let validForm = true;
    let criterion = true;
    let el = null;
    let el2 = null;

    // Validate password
    el = this.shadowRoot.querySelector('paper-input[name="password"]');
    el2 = this.shadowRoot.querySelector('paper-input[name="password-confirm"]');
    criterion = validatePassword(el.value);
    el.invalid = !criterion;
    validForm = criterion && validForm;
    criterion = el.value === el2.value;
    el2.invalid = !criterion;
    validForm = criterion && validForm;

    // Set invalid form warning
    let warningElement = this.shadowRoot.querySelector('#invalid-form-warning');
    let warningMessage = validForm || this.messageText === this.initMessageText ? html`` : html`
      <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
      Please correct the invalid inputs before submitting.
    `;
    render(
      warningMessage,
      warningElement
    );

    // Enable/disable submit button
    this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = !validForm;
  }

  _resetPassword() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "user/reset/password"
    let body = {
      'token': this.resetPasswordToken,
      'password': this.password
    };
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      this.shadowRoot.querySelector('paper-spinner').active = false;
      this.resetComplete = true;
      if (data.status === "ok" && data.reset) {
        this.resetSuccess = true;
        // console.log(JSON.stringify(data.users, null, 2));
      } else {
        this.errorMsg = data.msg;
        this.shadowRoot.querySelector('paper-toast[name="reset-fail"]').show();
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
}

window.customElements.define('des-reset',DESReset);
