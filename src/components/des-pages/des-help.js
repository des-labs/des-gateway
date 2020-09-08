import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles, HelpStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import '../des-help-cutout.js';
import '../des-help-jupyter.js';
import '../des-help-tilefinder.js';
import '../des-help-tables.js';
import '../des-help-status.js';
import '../des-help-db-access.js';
import '../des-help-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { triggerHelpForm } from '../../actions/app.js';
import { config } from '../des-config.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/paper-toast/paper-toast.js';
import { scrollToElement } from '../utils.js';

class DESHelp extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles,
      HelpStyles,
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
        paper-button:hover {
          background-color: darkred;
          color: white;
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
      <style>
        ul > li > a {
          text-decoration: none; 
          color: inherit;
        }
      </style>

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
              <paper-button @click="${(e) => {this.helpFormDialog.opened = true; }}" raised style="font-size: 1rem; margin: 1rem; padding-left: 2rem; padding-right: 2rem;"><iron-icon icon="vaadin:comments-o" style="height: 3rem; margin-right: 1rem;"></iron-icon>Contact us for help</paper-button>
            </div>
            <p>
            Follow the links below to learn more about the available apps and features:</p>
            <ul style="list-style-type: none; line-height: 2rem;">
            <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:external-browser"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('api-section'),100);}}">API Documentation
            </a></li>
            ${this.accessPages.includes('db-access') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:code"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('db-access-section'),100);}}">DB Access
            </a></li>
            ` : html``}
            ${this.accessPages.includes('tables') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:table"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('tables-section'),100);}}">DB Tables
            </a></li>
            ` : html``}
            ${this.accessPages.includes('cutout') && this.database !== 'desoper' ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:scissors"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('cutout-section'),100);}}">Cutout Service
            </a></li>
            ` : html``}
            ${this.accessPages.includes('status') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:clipboard-user"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('status-section'),100);}}">Job Status
            </a></li>
            ` : html``}
            ${this.accessPages.includes('tilefinder') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:globe-wire"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('tilefinder-section'),100);}}">TileFinder
            </a></li>
            ` : html``}
            ${this.accessPages.includes('jupyter') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:notebook"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('jupyter-section'),100);}}">Jupyter
            </a></li>
            ` : html``}
            ${this.accessPages.includes('ticket') ? html`
              <li><iron-icon style="color: black; margin-right: 1rem;" icon="vaadin:clipboard-user"></iron-icon><a href="#" onclick="return false;" @click="${(e) => {scrollToElement(this.shadowRoot.getElementById('ticket-section'),100);}}">DES Ticket
            </a></li>
            ` : html``}
            </ul>
          </section>

          <section id="api-section">
            <div>
              <h3>API Documentation</h3>
              <p>Everything you can do on this website can also be done by an external client app using the DESaccess Application Programming Interface (API). See the <a href="${config.frontEndUrl}docs/" target="_blank">API Documentation</a> for more details.</p>
            </div>
          </section>
          ${this.accessPages.includes('db-access') ? html`
          <section id="db-access-section">
            <des-help-db-access></des-help-db-access>
          </section>
          ` : html``}
          ${this.accessPages.includes('tables') ? html`
          <section id="tables-section">
            <des-help-tables></des-help-tables>
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
          ${this.accessPages.includes('tilefinder') ? html`
          <section id="tilefinder-section">
            <des-help-tilefinder></des-help-tilefinder>
          </section>
          ` : html``}
          ${this.accessPages.includes('jupyter') ? html`
          <section id="jupyter-section">
          <des-help-jupyter></des-help-jupyter>
          </section>
          ` : html``}
          ${this.accessPages.includes('ticket') ? html`
          <section id="ticket-section">
            <h3>DES Ticket</h3>
            <p>DESDM team members with admin privileges can use the DES Ticket app to resolve common user problems like password resets.</p>
          </section>
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
