import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { store } from '../../store.js';
import { config } from '../des-config.js';
import '@polymer/paper-spinner/paper-spinner.js';


class DESJupyter extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      username: {type: String},
      jupyter_url: {type: String},
      jupyter_token: {type: String},
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        `,
    ];
  }

  constructor(){
    super();
    this.username = '';
    this.jupyter_url = '';
    this.jupyter_token = '';
    this.createIntervalId = null;
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess Jupyter Lab
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div>
          <p>This page allows you to deploy a Jupyter Lab server <i>for your use only</i>.</p>
          <p>
            <b>Currently there is no persistent storage</b> for your Jupyter notebook files. Any files you 
            create or upload to Jupyter Lab will be lost when the server is destroyed, so for now you will
            have to manually download and upload notebooks.
          </p>
          <p style="color: red;">
            Server instances will be automatically deleted after approximately 24 hours.
          </p>
        </div>
        <paper-button id="deploy-jlab-button" @click="${this._create}" class="des-button" raised disabled
          style="display: none; font-size: 1rem; margin: 1rem; height: 2.2rem; width: auto;">
          <iron-icon icon="vaadin:rocket" style="height: 2rem; margin-right: 1rem;"></iron-icon>
          Deploy Jupyter Lab server
        </paper-button>
        <div id="delete-jlab-button">
          <paper-button @click="${this._delete}" class="des-button" raised disabled
            style="display: none; font-size: 1rem; margin: 1rem; height: 2.2rem; width: auto; background-color: darkred;">
            <iron-icon icon="vaadin:trash" style="height: 2rem; margin-right: 1rem;"></iron-icon>
            Destroy Jupyter Lab server
          </paper-button>
          
        </div>
        <div id="jlab-link" style="display: none;">
          <a href="${this.jupyter_url}" target="_blank">
            <paper-button class="des-button" raised
              style="font-size: 1rem; margin: 1rem; height: 2.2rem; width: auto;">
              <iron-icon icon="vaadin:notebook" style="height: 2rem; margin-right: 1rem;"></iron-icon>
              Open Jupyter Lab
            </paper-button>
          </a>
          <br>
          Created: <span></span>
        </div>
      </section>

    `;
  }

  firstUpdated() {
    this._status()
  }

  stateChanged(state) {
    this.username = state.app.username;
  }

  _create(event) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "jlab/create"
    let body = {};
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
      if (data.status === "ok") {
        console.log(JSON.stringify(data, null, 2));
        this.jupyter_url = data.url;
        this.jupyter_token = data.token;
        this.shadowRoot.querySelector('#deploy-jlab-button').disabled = true;
        this.createIntervalId = setInterval(() => {
          this._status();
        }, 3000)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });

  }
  
  _delete(event) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "jlab/delete"
    let body = {};
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
      if (data.status === "ok") {
        console.log(JSON.stringify(data, null, 2));
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').style.display = 'none';
        this.deleteIntervalId = setInterval(() => {
          this._status();
        }, 3000)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _status() {
    const Url=config.backEndUrl + "jlab/status"
    let body = {};
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
      if (data.status === "ok") {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
      if (data.ready_replicas === 0) {
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = true;
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').style.display = 'none';
        this.shadowRoot.querySelector('#deploy-jlab-button').disabled = false;
        this.shadowRoot.querySelector('#deploy-jlab-button').style.display = 'inline';
        this.shadowRoot.querySelector('#jlab-link').style.display = 'none';
      } else {
        this.jupyter_token = data.token;
        this.shadowRoot.querySelector('#jlab-link a').setAttribute('href', `${config.frontEndOrigin}/jlab/${this.username}?token=${this.jupyter_token}`);
        this.shadowRoot.querySelector('#jlab-link').style.display = 'block';
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').disabled = false;
        this.shadowRoot.querySelector('#delete-jlab-button paper-button').style.display = 'inline';
        this.shadowRoot.querySelector('#deploy-jlab-button').disabled = true;
        this.shadowRoot.querySelector('#deploy-jlab-button').style.display = 'none';
        this.shadowRoot.querySelector('#jlab-link span').innerHTML = this.convertToLocalTime(data.creation_timestamp.replace(/\+.*$/, ''));
      }
      if (this.createIntervalId) {
        clearInterval(this.createIntervalId);
        this.createIntervalId = null;
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
      if (this.deleteIntervalId) {
        clearInterval(this.deleteIntervalId);
        this.deleteIntervalId = null;
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    });
  }

}

window.customElements.define('des-jupyter', DESJupyter);
