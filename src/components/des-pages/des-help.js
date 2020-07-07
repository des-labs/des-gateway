import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import '../des-help-cutout.js';
import '../des-help-status.js';
import '../des-help-db-access.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

class DESHelp extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      database: {type: String},
    };
  }
  constructor(){
    super();
    this.accessPages = [];
    this.database = '';
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">DESaccess Help</div>
        <div class="horizontal layout around justified">
          <section>
            <p>DESaccess provides multiple tools you can use to access data from
            the Dark Energy Survey. Follow the links below to learn more:</p>
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
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
  }
}

window.customElements.define('des-help',DESHelp);
