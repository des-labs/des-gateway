import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import '../des-home-card.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import { config } from '../des-config.js';

class DESHome extends connect(store)(PageViewElement) {
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
        <div class="horizontal layout around justified">
          ${this.accessPages.includes('db-access') ? html`
            <a style = "text-transform: none; color:black;" href="db-access" tabindex="-1">
              <des-home-card heading="DB ACCESS" image="images/home-query.png" alt="Query" desc="Oracle SQL web client" name="query" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('cutout') && this.database !== 'desoper' ? html`
            <a style = "text-transform: none; color:black;" href="cutout" tabindex="-1">
              <des-home-card heading="CUTOUT SERVICE" image="images/home-coadd.png" alt="Bulk Cutout Service" desc="Generate cutout images" name="cutout" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('status') ? html`
            <a style = "text-transform: none; color:black;" href="status" tabindex="-1">
              <des-home-card heading="JOB STATUS" image="images/home-jobs.png" alt="Job Status" desc="List of submitted jobs" name="status" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('ticket') ? html`
            <a style = "text-transform: none; color:black;" href="ticket" tabindex="-1">
              <des-home-card heading="DES TICKET" image="images/decam.jpg" alt="DES Ticket" desc="DES database account management" name="ticket" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('users') ? html`
            <a style = "text-transform: none; color:black;" href="users" tabindex="-1">
              <des-home-card heading="DES USERS" image="images/users_app_art.png" alt="User Management" desc="DES user management" name="users" ></des-home-card>
            </a>
          ` : html``}
          ${this.accessPages.includes('notifications') ? html`
            <a style = "text-transform: none; color:black;" href="notifications" tabindex="-1">
              <des-home-card heading="DES NOTIFICATIONS" image="images/notifications_app_art.png" alt="Notifications Management" desc="DES notifications" name="notifications" ></des-home-card>
            </a>
          ` : html``}
          <a style = "text-transform: none; color:black;" href="help" tabindex="-1">
            <des-home-card heading="HELP" image="images/home-help.jpg" alt="Help" desc="View documentation and seek help" name="help" ></des-home-card>
          </a>
        </div>
      </section>
      <vaadin-dialog></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
    this.database = state.app.db;
  }

  firstUpdated() {

    this.alphaWelcomeDialog = this.shadowRoot.querySelector('vaadin-dialog');
    this.alphaWelcomeDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
          </style>
          <div style="max-width: 1000px; width: 85vw; max-height: 80vh;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Welcome to the <i>DESaccess Alpha Release !</i></h3>
            <div style="max-height: 70vh; overflow: auto; padding: 1rem;">
              <p>Thank you for participating in the DESaccess alpha release testing. While we hope
              that everything works perfectly for you, we know that some bugs are best found when actual
                users like you do what you do best: <i>use the software</i>!</p>
              <p>When you encounter problems, first take a look at the available documentation by pressing the red Help button
                <iron-icon icon="vaadin:question-circle-o" style="color: red;"></iron-icon>
              in the upper right corner of the page. If you think you have discovered a bug, or if you simply have suggestions
              for how to make DESaccess better, please <a href="${config.frontEndUrl}help/form" @click="${(e) => {dialog.opened = false;}}">contact us using the Help Request form</a>.</p>
              <p>As we continue to update this alpha release, in part based on your feedback, we will inform you of the changes
              via this site and our dedicated Slack channel <a href="https://darkenergysurvey.slack.com/archives/G017KUZ67U1" target="_blank">#desaccess-alpha-testing</a>.
              A notification icon <iron-icon icon="vaadin:bell" style="color: auto;"></iron-icon> will appear in the toolbar when you have new messages.</p>
              <p>Sincerely,<br><b>DES Labs Team</b></p>
            </div>
          </div>
        `,
        container
      );
    }
    this.alphaWelcomeDialog.opened = true;
  }
}

window.customElements.define('des-home',DESHome);
