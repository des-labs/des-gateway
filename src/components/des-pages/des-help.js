import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import '../des-help-cutout.js';
import '../des-help-status.js';
import '../des-help-db-access.js';
import '../des-help-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { triggerHelpForm } from '../../actions/app.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-toast/paper-toast.js';

class DESHelp extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles,
      css`
        a {
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        .red-links a {
          color: darkred;
        }
      `
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      database: {type: String},
      email: {type: String},
      firstname: {type: String},
      lastname: {type: String},
      submit_disabled: {type: Boolean},
      formTopicOther: {type: Boolean},
      triggerHelpForm: {type: Boolean},
    };
  }
  constructor(){
    super();
    this.accessPages = [];
    this.database = '';
    this.email = '';
    this.firstname = '';
    this.lastname = '';
    this.formTopicOther = false;
    this.submit_disabled = true;
    this.triggerHelpForm = false;
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">DESaccess Help</div>
        <div class="horizontal layout around justified">
          <section>
            <p class="red-links">DESaccess is a collection of apps and services from the <a href="https://deslabs.ncsa.illinois.edu/" target="_blank">DES Labs</a>
            team at the <a href="http://www.ncsa.illinois.edu/" target="_blank">National Center for Supercomputing Applications</a> that
            provides multiple tools you can use to access data from
            the <a href="https://www.darkenergysurvey.org/" target="_blank">Dark Energy Survey</a>.
            </p>
            <div style="text-align: center;">
              <paper-button @click="${(e) => {this.helpFormDialog.opened = true; }}" raised style="font-size: 1rem; margin: 1rem;"><iron-icon icon="vaadin:comments-o" style="height: 3rem; margin-right: 1rem;"></iron-icon>Contact us for help</paper-button>
            </div>
            <p>
            Follow the links below to learn more about the available apps:</p>
            <ul style="list-style-type: none;">
            ${this.accessPages.includes('db-access') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:code"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {this.shadowRoot.getElementById('db-access-section').scrollIntoView();}}">DB Access</a></li>
            ` : html``}
            ${this.accessPages.includes('cutout') && this.database !== 'desoper' ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:scissors"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {this.shadowRoot.getElementById('cutout-section').scrollIntoView();}}">Cutout Service</a></li>
            ` : html``}
            ${this.accessPages.includes('status') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:clipboard-user"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {this.shadowRoot.getElementById('status-section').scrollIntoView();}}">Job Status</a></li>
            ` : html``}
            </ul>
          </section>

          ${this.accessPages.includes('db-access') ? html`
          <section id="db-access-section">
            <des-help-db-access></des-help-db-access>
          </section>
          ` : html``}
          ${this.accessPages.includes('cutout') && this.database !== 'desoper' ? html`
          <section id="cutout-section">
            <des-help-cutout></des-help-cutout>
          </section>
          ` : html``}
          ${this.accessPages.includes('status') ? html`
          <section id="status-section">
            <des-help-status></des-help-status>
          </section>
          ` : html``}
          ${this.accessPages.includes('ticket') ? html`
            <h3>DES Ticket</h3>
            <p>DESDM team members with admin privileges can use the DES Ticket app to resolve common user problems like password resets.</p>
          ` : html``}
        </div>
      </section>
      <vaadin-dialog id="help-form-dialog"></vaadin-dialog>
      <paper-toast class="toast-position toast-success" text="Your help request was received." duration="7000"></paper-toast>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
    this.triggerHelpForm = state.app.triggerHelpForm;
    this.email = this.email === '' ? state.app.email : this.email;
    this.firstname = this.firstname === '' ? state.app.name : this.firstname;
    this.lastname = this.lastname === '' ? state.app.lastname : this.lastname;
  }

  firstUpdated() {

    this.helpFormDialog = this.shadowRoot.getElementById('help-form-dialog');
    this.helpFormDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <div style="width: 85vw; max-width: 700px; height: 85vh; max-height: 850px;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <des-help-form
              @closeHelpDialog="${(e) => {dialog.opened = false;}}"
              @showHelpSuccessMessage="${(e) => {this.shadowRoot.querySelector('paper-toast').show();}}"
            ></des-help-form>
          </div>
        `,
        container
      );
    }
    if (this.triggerHelpForm) {
      this.helpFormDialog.opened = true;
      store.dispatch(triggerHelpForm(false));
    }
  }
}

window.customElements.define('des-help',DESHelp);
