import { html,css } from 'lit-element';
import { LitElement } from 'lit-element';
import { render } from 'lit-html';
import { SharedStyles } from './styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { config } from './des-config.js';
import { validateEmailAddress } from './utils.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-spinner/paper-spinner.js';

class DESHelpForm extends connect(store)(LitElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      email: {type: String},
      firstname: {type: String},
      lastname: {type: String},
      topicOtherChecked: {type: Boolean},
      topicOtherName: {type: String},
      messageText: {type: String},
      topics: {type: Array},
    };
  }

  constructor(){
    super();
    this.email = '';
    this.firstname = '';
    this.lastname = '';
    this.topicOtherChecked = false;
    this.messageEdited = false;
    this.topicOtherName = '';
    this.messageText = '';
    this.topics = [];
  }

  render() {
    return html`
      <style>
        .topic-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: 1001px) {
          .topic-grid {
            grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 501px) {
          .topic-grid {
            grid-template-columns: 1fr;
        }
      </style>
      <h3><iron-icon icon="vaadin:clipboard-text" style="margin-right: 1rem;"></iron-icon>Help Request Form</h3>
      <div style="margin: 1rem; color: red; height: 2rem;">
        <span id="invalid-form-warning"></span>
      </div>
      <div style="max-height: 70vh; overflow: auto; padding: 1rem; border: 1px lightgray solid;">
        <paper-input name="firstname" label="First" required value="${this.firstname}" @change="${e => this.firstname = e.target.value}"></paper-input>
        <paper-input name="lastname"  label="Last"  required value="${this.lastname}"  @change="${e => this.lastname = e.target.value}"></paper-input>
        <paper-input name="email"     label="Email" required value="${this.email}"     @change="${e => this.email = e.target.value}"></paper-input>

        <div>
          <p><b>How can we help?</b></p>
          <iron-autogrow-textarea name="question" rows="6" style="width:90%; padding: 1rem;" placeholder="Write your message to us here."></iron-autogrow-textarea>
        </div>

        <p><b>Select all relevant topics:</b></p>
        <div class="topic-grid">
          <div>
            <paper-checkbox name="topic" value="DR1 Release"> DR1 Release</paper-checkbox>
            <br><paper-checkbox name="topic" value="Interfaces"> User Interfaces </paper-checkbox>
            <br><paper-checkbox name="topic" value="LIneA Portal"> LIneA Science Server </paper-checkbox>
          </div>
          <div>
            <paper-checkbox name="topic" value="User Accounts"> User Accounts </paper-checkbox>
            <br><paper-checkbox name="topic" value="Files format/access"> File formats / File access </paper-checkbox>
            <br><paper-checkbox name="topic" value="SVA1 Gold"> SVA1 Gold</paper-checkbox>
          </div>
          <div>
            <paper-checkbox name="topic" value="General Questions"> General questions </paper-checkbox>
            <br><paper-checkbox name="topic" value="Other" @change="${(e) => {this.topicOtherChecked = e.target.checked;}}" ?checked="${this.topicOtherChecked}"> Other </paper-checkbox>
          </div>
        </div>
        <div>
          <paper-input    name="topic" label="Please supply topic if checked 'Other'" @change="${(e) => {this.topicOtherName = e.target.value;}}" ?disabled="${!this.topicOtherChecked}" style="display: none;"> </paper-input>
        </div>

        <div style="text-align: center; margin: 1rem;">
          <paper-button  name="submit-button" class="indigo" @click="${(e) => {this._submitHelpForm(e);}}" raised disabled>Submit Form</paper-button>
          <paper-spinner class="big"></paper-spinner>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    // The onchange attribute does not seem to work, so manually add event listeners
    // to the message text input to capture the value as text is typed. The
    // messageEdited boolean prevent a red warning before the user has a chance to
    // enter text.
    let messageInput = this.shadowRoot.querySelector('iron-autogrow-textarea');
    let messageWatcher = (event) => {
      this.messageTextDynamic = messageInput.value;
    };
    messageInput.addEventListener('focus', (e) => {
      this.messageEdited = true;
      messageInput.addEventListener('keyup', messageWatcher);
    });
    messageInput.addEventListener('blur', (e) => {
      messageInput.removeEventListener('keyup', messageWatcher);
      this.messageText = this.messageTextDynamic;
    });

    // Set onchange listeners for each topic checkbox to update the topic list
    this.shadowRoot.querySelectorAll('paper-checkbox[name="topic"]').forEach((item) => {
      item.addEventListener('change', (e) => {
        if (e.target.checked) {
          // Add topic to selected topics
          this.topics.push(e.target.value);
        } else {
          if (this.topics.indexOf(e.target.value) > -1) {
            this.topics.splice(topics.indexOf(e.target.value), 1);
          }
        }
      });
    });
  }

  stateChanged(state) {
    this.email = this.email === '' ? state.app.email : this.email;
    this.firstname = this.firstname === '' ? state.app.name : this.firstname;
    this.lastname = this.lastname === '' ? state.app.lastname : this.lastname;
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'topicOtherChecked':
          this.shadowRoot.querySelector('paper-input[name="topic"]').style.display = this.shadowRoot.querySelector('paper-checkbox[value="Other"]').checked ? 'block' : 'none';
        default:
          // Assume that we want to revalidate the form when a property changes
          this._validateForm();
      }
    });
  }

  _validateForm() {
    let validForm = true;
    let criterion = true;
    let el = null;
    // Validate email address
    criterion = validateEmailAddress(this.email);
    this.shadowRoot.querySelector('paper-input[name="email"]').invalid = !criterion;
    validForm = criterion && validForm;

    // Validate first name
    el = this.shadowRoot.querySelector('paper-input[name="firstname"]');
    criterion = el.value.length > 0;
    el.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate last name
    el = this.shadowRoot.querySelector('paper-input[name="lastname"]');
    criterion = el.value.length > 0;
    el.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate topic selection
    el      = this.shadowRoot.querySelector('paper-checkbox[value="Other"]');
    let el2 = this.shadowRoot.querySelector('paper-input[name="topic"]');
    criterion = el.checked && el2.value.length > 0 || !el.checked;
    el2.invalid = !criterion;
    validForm = criterion && validForm;

    // Validate message
    criterion = this.messageText.length > 0;
    el = this.shadowRoot.querySelector('iron-autogrow-textarea');
    let borderColor = criterion || !this.messageEdited ? 'black' : 'red';
    el.style['border-color'] = borderColor;
    validForm = criterion && validForm;

    // Set invalid form warning
    let warningElement = this.shadowRoot.querySelector('#invalid-form-warning');
    let warningMessage = validForm || !this.messageEdited ? html`` : html`
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

  _submitHelpForm(event) {
    // Start spinner to inform that the form is being submitted
    this.shadowRoot.querySelector('paper-spinner').active = true;
    // Disable submit button to prevent redundant submissions
    this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = true;
    // Clear any displayed warning messages
    let warningElement = this.shadowRoot.querySelector('#invalid-form-warning');
    let warningMessage = html``;
    render(warningMessage, warningElement);


    // Submit form to backend API endpoint
    const Url=config.backEndUrl + "page/help/form"
    let body = {
      // Get username from auth token
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'message': this.messageText,
      'topics': this.topics,
      'othertopic': this.topicOtherName
    };
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        // Send custom event up to parent web component to close the dialog
        this.dispatchEvent(new CustomEvent('closeHelpDialog'));
        this.dispatchEvent(new CustomEvent('showHelpSuccessMessage'));

        // console.log(JSON.stringify(data.users, null, 2));
      } else {
        // Set error message
        warningMessage = html`
          <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
          Error submitting the help form: ${data.msg}
        `;
        render(warningMessage, warningElement);
        this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = false;
        console.log(JSON.stringify(data, null, 2));
      }
    })
    .catch(error => {
      // Stop spinner to inform that the server has responded
      this.shadowRoot.querySelector('paper-spinner').active = false;
      // Set error message
      warningMessage = html`
        <iron-icon icon="vaadin:exclamation-circle" style="margin-right: 1rem;"></iron-icon>
        Error submitting the help form. Wait a few seconds and try again.
      `;
      render(warningMessage, warningElement);
      this.shadowRoot.querySelector('paper-button[name="submit-button"]').disabled = false;

    });
  }

}

window.customElements.define('des-help-form', DESHelpForm);
