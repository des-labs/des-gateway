import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';

class DESHome extends PageViewElement {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  constructor(){
    super();
  }

  render() {
    return html`
      <section>
        <div class="horizontal layout around justified">
          ${this.accessPages.includes('db-access') ? html`
            <a style = "text-transform: none; color:black;" href="db-access" tabindex="-1">
              <des-home-card heading="DB ACCESS" image="images/home-query.png" alt="Query" desc="Oracle SQL web client" name="query" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('cutout') ? html`
            <a style = "text-transform: none; color:black;" href="cutout" tabindex="-1">
              <des-home-card heading="CUTOUT SERVICE" image="images/home-coadd.png" alt="Bulk Cutout Service" desc="Generate cutout images" name="cutout" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('status') ? html`
            <a style = "text-transform: none; color:black;" href="status" tabindex="-1">
              <des-home-card heading="MY JOBS" image="images/home-jobs.png" alt="My Jobs" desc="List of submitted jobs" name="status" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('ticket') ? html`
            <a style = "text-transform: none; color:black;" href="status" tabindex="-1">
              <des-home-card heading="DES TICKET" image="images/decam.jpg" alt="DES Ticket" desc="DES database account management" name="ticket" ></des-home-card>
            </a>
          ` : html``}
        </div>
      </section>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }
}

window.customElements.define('des-home',DESHome);
