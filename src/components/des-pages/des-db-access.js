import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vanillawc/wc-codemirror/index.js';
import '@vanillawc/wc-codemirror/mode/sql/sql.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';

class DESDbAccess extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _value: { type: Number },
      query: {type: String},
      msg: {type: String},
      results: {type: String},
      submit_disabled: {type: Boolean},
      // username: {type: String},
      // validEmail: {type: Boolean},
      // email: {type: String},
      validOutputFile: {type: Object},
      // validCompression: {type: Boolean},
      refreshStatusIntervalId: {type: Number},
      compressOutputFile: {type: Boolean},
      quickQuery: {type: Boolean}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .test {color:  black;}

        .query-container {
            display: grid;
            grid-gap: 1rem;
            padding: 1rem;
        }
        .query-controls-container {
            display: grid;
            grid-gap: 1rem;
            padding: 1rem;
        }
        .query-input-controls {
            display: grid;
            /* grid-gap: 1rem; */
            /* padding: 1rem; */
        }

        @media all and (min-width: 1000px) {

          .query-container {
            grid-template-columns: 35% 65%;
          }

          .query-controls-container {
            grid-template-columns: 100%;
          }

          .query-input-controls {
            grid-template-columns: 33% 33% 33%;
          }
        }

        .query-row-2 {
            @apply(--layout-horizontal);
            @apply(--layout-around-justified);

        }

        .query-input-box {
          border: 1px solid #CCCCCC;
        }
        .query-input-container {
            margin-right: 2%;
        }

        .query-op {
            @apply(--layout-around-justified);

        }

        .query-cb {
            @apply(--layout-around-justified);
        }

        .query-item {
            text-align: left;
        }

        .btn-wrap {
            margin-top: 5px;
            height: 2rem;
            line-height: 0.5rem;
            text-align: center;
        }

        .query-td-2 {
            text-align: center;
            line-height: 15%;
        }

        .queryMsg {
            font-size: 20px;
            font-weight: bold;
        }

        .carousel-item {
            width: 100%;
            text-align: center;
        }
        .paper-carousel {
            width: 100%;
            height: 100%;

        }

        paper-button.medium {
            font-size: 15px;
        }

        paper-button.indigo {
          background-color: var(--paper-indigo-500);
          color: white;
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
          };
        }

        paper-button[disabled] {
            background: #eaeaea;
            color: #a8a8a8;
            cursor: auto;
            pointer-events: none;
        }

        paper-button.nocapitals {
          text-transform: none;
        }

        .dialog-position {
            width: 100%;
            height: 90%;
            margin-left: 30px;
            margin-right: 30px;
            margin-top: 20px;
            position: absolute;
        }
        .invalidFormFlag {
          color: red;
        }
        #submit-button {
          padding-top: 1rem;
          font-weight: bold;
          background-color: var(--paper-indigo-500);
          color: white;
          height: 3rem;
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-indigo-a250) !important;
          color: white !important;
          };
          box-shadow: 3px -3px 4px 3px rgba(63,81,181,0.7);
        }
        #submit-button[disabled] {
            background: #eaeaea;
            color: #a8a8a8;
            cursor: auto;
            pointer-events: none;
            box-shadow: 3px -3px 8px 8px rgba(184,184,184,0.7);
        }
        .toast-error {
          --paper-toast-color: #FFD2D2 ;
          --paper-toast-background-color: #D8000C;
        }
        .toast-success {
          --paper-toast-color:  #DFF2BF;
          --paper-toast-background-color: #4F8A10;
        }
        /* #submit-container {
          position: fixed;
          left: 250px;
          bottom: 0%;
          z-index: 1;
        } */
        `,
    ];
  }


  constructor(){
    super();
    // this.username = '';
    // this.email = '';
    // this.validEmail = false;
    this.query = '';
    this.results = '';
    this.msg = "";
    this.submit_disabled = true;
    this.validOutputFile = {file: '',valid: false};
    this.compressOutputFile = false;
    this.quickQuery = false;
    this.refreshStatusIntervalId = 0;
    // this.validCompression = false;
  }

  render() {
    return html`
      <section>
      <div class="query-container">
        <div class="query-controls-container">
          <div>
            <h3>Output file</h3>
            <paper-checkbox
              @change="${(e) => {this.quickQuery = e.target.checked}}"
              id="option-quick-query">Quick query</paper-checkbox>
            <paper-input
              style="max-width: 20rem;"
              placeholder="my-output-file.csv" value="${this.validOutputFile.file}"
              @change="${this._validateOutputFile}"
              label="Output file name (.csv, .fits or .h5)"
              id="output-filename"></paper-input>
            <paper-checkbox
              @change="${(e) => {this.compressOutputFile = e.target.checked}}"
              style="padding-left: 1rem;"
              always-float-label
              id="option-compress-files" name="option-compress-files" disabled>Compress files (.csv and .h5 only)</paper-checkbox>

          </div>
          <div>
            <h3>Options</h3>
            <paper-input
              always-float-label
              style="max-width: 20rem;"
              placeholder="" value="${this.customJobName}"
              label="Custom job name (example: my-custom-job.12)"
              @change="${(e) => {this.customJobName = e.target.value}}"
              id="custom-job-name" name="custom-job-name"></paper-input>
          </div>
          <div id="email-options">
            <!-- <p id="email-options-invalid" style="display: none; color: red;">Please enter a valid email address.</p> -->
            <paper-checkbox
              @change="${(e) => {this._updateEmailOption(e)}}"
              style="font-size:16px;"
              id="send-email">Email when complete</paper-checkbox>
            <paper-input
              @change="${(e) => {this.email = e.target.value;}}"

              disabled
              id="custom-email"
              name="custom-email"
              label="Email Address"
              style="max-width: 500px;"
              placeholder="${this.email}"
              value="${this.email}"></paper-input>
          </div>

          <div style="display: grid; justify-content: center;">
            <div>
              <!--
              <div class="btn-wrap">
                  <paper-button class="indigo medium" raised @tap="${this._clearQueryBox}">Clear</paper-button>
              </div>
              -->
              <div id="submit-container">
                <paper-button id="submit-button" class="indigo medium" raised ?disabled="${this.submit_disabled}" @click="${e => this._submit(e)}"
                  style="height: 3rem;">Submit Job</paper-button>
                <paper-spinner id="submit-spinner" class="big"></paper-spinner>
              </div>
            </div>
          </div>

        </div>
        <div class="query-input-container">
          <p>Insert your query in the box below. Data results for "Quick" Jobs (30 sec.) will be displayed at the bottom.</p>
          <div id="queryBox" class="query-input-box">
              <wc-codemirror id="wc-codemirror-element" mode="sql" src="images/example-query.sql" lineNumbers="false"></wc-codemirror>
          </div>
          <div class="query-input-controls">
              <div class="btn-wrap">
                <paper-button class="indigo medium" raised @tap="${this._checkSyntax}">Check</paper-button>
              </div>
              <!-- <div class="btn-wrap">
                <paper-button id="QuickQuery" class="indigo medium" raised @tap="${this._quickSubmit}">Quick</paper-button>
              </div> -->
              <div class="btn-wrap">
                <a href = "/easyweb/db-examples" style="text-decoration: none;" tabindex="-1">
                <paper-button class="indigo medium" raised >See Examples</paper-button>
                </a>
              </div>
          </div>
        </div>
      </div>
      </section>
      <section>
        <div style="font-family: monospace;">
          <textarea id="results-textarea" name="results-textarea" rows="20" style="width: 100%;"></textarea>
        </div>
      </section>
      <div>
        <paper-toast class="toast-position toast-success" id="toast-job-success" text="Job has been submitted!" duration="7000"> </paper-toast>
        <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
      </div>
    `;
  }
  // _clearQueryBox(){
  //   this.query = '';
  //   this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
  //   console.log(this.editor)
  //   this.editor.setValue('-- Insert Query --\n\n');
  //   this.editor.focus();
  //   this.editor.execCommand('goLineDown');
  // }

  _validateOutputFile(event){
    const outputfile = event.target.value
    let valid = false;
    switch (true) {
      case (outputfile.endsWith('.csv')):
      case (outputfile.endsWith('.h5')):
        this.shadowRoot.getElementById('option-compress-files').disabled = false;
        valid = true;
        break;
      case (outputfile.endsWith('.fits')):
        valid = true;
        this.shadowRoot.getElementById('option-compress-files').checked = false;
      default:
        this.shadowRoot.getElementById('option-compress-files').disabled = true;
        this.compressOutputFile = false;
        break;
    }
    this.shadowRoot.getElementById('output-filename').invalid = !valid;
    this.validOutputFile = {file: outputfile,valid: valid};
  }

  _validateSyntax(){
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    this.query = this.editor.getValue();
  }

  _validateForm() {
    // const outputfile = this.validOutputFile.file
    // let validCompression = false;
    // if (this.compressOutputFile == false){
    //   validCompression = true
    // }
    // else if (this.compressOutputFile && (outputfile.endsWith('.csv') || outputfile.endsWith('.h5'))){
    //   validCompression = true
    // }

    // Validate email
    this.shadowRoot.getElementById('custom-email').invalid = !this.validEmail;
    // Validate custom job name
    let validCustomJobName = !this.shadowRoot.getElementById('custom-job-name').invalid

    var validForm = (this.validEmail && this.validOutputFile.valid && validCustomJobName) || this.quickQuery;
    // Enable/disable submit button
    if (this.refreshStatusIntervalId === 0) {
      this.submit_disabled = !validForm;
    }
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = state.app.email;
  }

  _submitJob(callback){
    const Url=config.backEndUrl + config.apiPath +  "/job/submit";

     /* Removing comments from query string */
     this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
     var query_lines = this.editor.doc.getValue().split('\n');
     var i;
     for (i = 0; i < query_lines.length; i++) {
       if (query_lines[i].startsWith('--') == false && query_lines[i] !== "") {
         this.query = query_lines[i]
       }
     }
    var body = {
      job: 'query',
      username: this.username,
      query: this.query,
    };
    if (this.quickQuery) {
      body.quick = "true";
    }
    const param = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
    body: JSON.stringify(body)
    };
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        that.shadowRoot.getElementById('toast-job-success').text = 'Job submitted';
        that.shadowRoot.getElementById('toast-job-success').show();
        if (that.quickQuery) {
          // TODO: Set up polling of status until results are fetched.
          that._pollQuickQueryResult(data.jobid);
        }
      } else {
        that.shadowRoot.getElementById('toast-job-failure').text = 'Error submitting job';
        that.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
      callback();
    });

  }

  _pollQuickQueryResult(jobId) {

    if (this.refreshStatusIntervalId === 0) {
      this.refreshStatusIntervalId = window.setInterval(() => {
        this._getJobStatus(jobId);
      }, 3000);
    }
  }

  _getJobStatus(jobId) {
    const Url=config.backEndUrl + config.apiPath +  "/job/status"
    let body = {
      'job-id': jobId,
    };
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        if (data.jobs[0].job_status == 'success' || data.jobs[0].job_status == 'failure') {
          let results = JSON.parse(data.jobs[0].data);
          that.results = JSON.stringify(results);
          window.clearInterval(that.refreshStatusIntervalId);
          that.refreshStatusIntervalId = 0;
          this._toggleSpinner(false, () => {});
          this.shadowRoot.getElementById('results-textarea').value = that.results;

        }
        //TODO: Display results
      } else {
        console.log(JSON.stringify(data));
      }
    });
  }
  _toggleSpinner(active, callback) {
    this.submit_disabled = active;
    this.shadowRoot.getElementById('submit-button').disabled = this.submit_disabled;
    this.shadowRoot.getElementById('submit-spinner').active = active;
    callback();
  }

  _submit(event) {
    if (!this.submit_disabled) {
      var that = this;
      this._toggleSpinner(true, () => {
        this._submitJob(() => {
          this._toggleSpinner(this.quickQuery, () => {});
        });
      });
    }
  }
  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'submit_disabled':
          this.shadowRoot.getElementById('submit-button').disabled = this.submit_disabled;
          break;
        case 'quickQuery':
          this.shadowRoot.getElementById('output-filename').disabled = this.quickQuery;
        case 'email':
          this.validEmail = this._validateEmail(this.email);
        case 'customJobName':
          var originalName = this.customJobName;
          var isValidJobName = this.customJobName === '' || (this.customJobName.match(/^[a-z0-9]([-a-z0-9]*[a-z0-9])*(\.[a-z0-9]([-a-z0-9]*[a-z0-9])*)*$/g) && this.customJobName.length < 129);
          this.shadowRoot.getElementById('custom-job-name').invalid = !isValidJobName;
        default:
          // Assume that we want to revalidate the form when a property changes
          this._validateForm();
      }
    });
  }

}
window.customElements.define('des-db-access', DESDbAccess);
