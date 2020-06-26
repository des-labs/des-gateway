import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
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
    };
  }
  constructor(){
    super();
    this.accessPages = [];
  }

  render() {
    return html`
      <section>
        <h2>Welcome to DESaccess!</h2>
        <div class="horizontal layout around justified">
          <p>DESaccess provides multiple tools you can use to access data from the Dark Energy Survey.</p>

          ${this.accessPages.includes('db-access') ? html`
            <h3>DB Access</h3>
            <p>The database access page allows you to submit your own OracleDB queries directly to the database.</p>
          ` : html``}
          ${this.accessPages.includes('cutout') ? html`
            <h3>Cutout Service</h3>
            <p>The Cutout Service allows you to download raw or color image data based on input coordinates and areal dimensions.</p>
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
  }
}

window.customElements.define('des-help',DESHelp);
