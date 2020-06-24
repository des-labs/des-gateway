import { html,css } from 'lit-element';
import { render } from 'lit-html';
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
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import { updateQuery } from '../../actions/app.js';

class DESDbAccess extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      query: {type: String},
      msg: {type: String},
      results: {type: String},
      submit_disabled: {type: Boolean},
      validOutputFile: {type: Object},
      refreshStatusIntervalId: {type: Number},
      compressOutputFile: {type: Boolean},
      quickQuery: {type: Boolean},
      username: {type: String},
      validEmail: {type: Boolean},
      email: {type: String},
      customJobName: {type: String}
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
        #submit-button-query {
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
          /* box-shadow: 3px -3px 4px 3px rgba(63,81,181,0.7); */
        }
        #submit-button-query[disabled] {
            background: #eaeaea;
            color: #a8a8a8;
            cursor: auto;
            pointer-events: none;
            /* box-shadow: 3px -3px 8px 8px rgba(184,184,184,0.7); */
        }
        .toast-error {
          --paper-toast-color: #FFD2D2 ;
          --paper-toast-background-color: #D8000C;
        }
        .toast-success {
          --paper-toast-color:  #DFF2BF;
          --paper-toast-background-color: #4F8A10;
        }
        .valid-form-element {
          display: none;
        }

        .invalid-form-element {
          display: block;
          color: red;
          font-size: 0.75rem;
          padding-left:2rem;
          max-width: 500px;
        }
        .CodeMirror {
          font-size: 0.8rem;
          height: 24rem;
        }
        `,
    ];
  }


  constructor() {
    super();
    this.query = '';
    this.results = '';
    this.msg = "";
    this.submit_disabled = true;
    this.validOutputFile = {file: '',valid: false};
    this.compressOutputFile = false;
    this.quickQuery = false;
    this.refreshStatusIntervalId = 0;
    this.username = '';
    this.email = '';
    this.customJobName = '';
    this.validEmail = false;
    this._queryExampleRenderer = this._queryExampleRenderer.bind(this); // need this to invoke class methods in renderers
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
          <div id="options-controls">
            <h3>Options</h3>
            <paper-input
              always-float-label
              style="max-width: 20rem;"
              placeholder="" value="${this.customJobName}"
              label="Custom job name (example: my-custom-job.12)"
              @change="${(e) => {this.customJobName = e.target.value}}"
              id="custom-job-name" name="custom-job-name"></paper-input>
            <p id="custom-job-invalid" class="valid-form-element">
              Custom job name must consist of lower case alphanumeric characters,
              '-' or '.', and must start and end with an alphanumeric character.
              Maximum length is 128 characters.
            </p>
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
              <p id="custom-email-invalid" class="valid-form-element">
                Enter a valid email address.
              </p>
          </div>

          <div style="display: grid; justify-content: center;">
            <div>
              <!--
              <div class="btn-wrap">
                  <paper-button class="indigo medium" raised @tap="${this._clearQueryBox}">Clear</paper-button>
              </div>
              -->
              <div id="submit-container">
                <paper-button id="submit-button-query" class="indigo medium" raised ?disabled="${this.submit_disabled}" @click="${(e) => this._submit(e)}"
                  style="height: 3rem;">Submit Job</paper-button>
                <paper-spinner id="submit-spinner" class="big"></paper-spinner>
              </div>
            </div>
          </div>

        </div>
        <div class="query-input-container">
          <p>Insert your query in the box below. Data results for "Quick" Jobs (30 sec.) will be displayed at the bottom.</p>
          <div id="queryBox" class="query-input-box">
              <wc-codemirror id="query-input-editor" mode="sql" src="images/example-query-0.sql"></wc-codemirror>
          </div>
          <div class="query-input-controls">
              <div class="btn-wrap">
                <paper-button id="check-syntax-button" class="indigo medium" raised>Check syntax</paper-button>
              </div>
              <div class="btn-wrap">
                <paper-button id="query-examples-button" class="indigo medium" raised>See Examples</paper-button>
              </div>
          </div>
        </div>
      </div>
      </section>
      <section id="results-textarea-container" style="display: none;">
      </section>
      <div>
        <paper-toast class="toast-position toast-success" id="toast-job-success" text="Job has been submitted!" duration="7000"> </paper-toast>
        <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
      </div>
      <vaadin-dialog id="query-examples-dialog" aria-label="simple"></vaadin-dialog>
      <dom-module id="my-grid-styles" theme-for="vaadin-grid">
        <template>
          <style>
            .monospace-column {
              font-family: monospace;
              font-size: 0.8rem;
            }
          </style>
        </template>
      </dom-module>

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

  _updateEmailOption(event) {
    this.shadowRoot.getElementById('custom-email').disabled = !event.target.checked;
    this.shadowRoot.getElementById('custom-email').invalid = this.shadowRoot.getElementById('custom-email').invalid && !this.shadowRoot.getElementById('custom-email').disabled;
    this.validEmail = this._validateEmailAddress(this.email);
    this._validateForm();
  }

  _validateOutputFile(event){
    const outputfile = this.shadowRoot.getElementById('output-filename').value;
    let valid = false;
    switch (true) {
      case (outputfile.endsWith('.csv')):
      case (outputfile.endsWith('.h5')):
        this.shadowRoot.getElementById('option-compress-files').disabled = this.quickQuery;
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
    // Disable invalid warnings if quick query is checked
    this.shadowRoot.getElementById('output-filename').disabled = this.quickQuery;
    this.shadowRoot.getElementById('output-filename').invalid = !(valid || this.quickQuery);
    this.validOutputFile = {file: outputfile,valid: valid};
  }

  _validateEmail(event){
    this.validEmail = this._validateEmailAddress(this.email);
    let criterion = this.validEmail || this.quickQuery;
    this.shadowRoot.getElementById('custom-email').invalid = !criterion;
    this.shadowRoot.getElementById('send-email').disabled = this.quickQuery;
    this.shadowRoot.getElementById('custom-email').disabled = this.quickQuery || !this.shadowRoot.getElementById('send-email').checked;
    if (criterion) {
      this.shadowRoot.getElementById('custom-email-invalid').classList.remove('invalid-form-element');
      this.shadowRoot.getElementById('custom-email-invalid').classList.add('valid-form-element');
    } else {
      this.shadowRoot.getElementById('custom-email-invalid').classList.remove('valid-form-element');
      this.shadowRoot.getElementById('custom-email-invalid').classList.add('invalid-form-element');
    }
  }
  _validateCustomJobName(event){

    var originalName = this.customJobName;
    var isValidJobName = this.customJobName === '' || (this.customJobName.match(/^[a-z0-9]([-a-z0-9]*[a-z0-9])*(\.[a-z0-9]([-a-z0-9]*[a-z0-9])*)*$/g) && this.customJobName.length < 129);
    // Disable invalid warnings if quick query is checked
    isValidJobName = isValidJobName || this.quickQuery;
    this.shadowRoot.getElementById('custom-job-name').disabled = this.quickQuery;
    this.shadowRoot.getElementById('custom-job-name').invalid = !isValidJobName;
    if (isValidJobName) {
      this.shadowRoot.getElementById('custom-job-invalid').classList.remove('invalid-form-element');
      this.shadowRoot.getElementById('custom-job-invalid').classList.add('valid-form-element');
    } else {
      this.shadowRoot.getElementById('custom-job-invalid').classList.remove('valid-form-element');
      this.shadowRoot.getElementById('custom-job-invalid').classList.add('invalid-form-element');
    }
  }
  //
  // _validateSyntax(){
  //   this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
  //   this.query = this.editor.getValue();
  // }

  _validateForm() {
    let criterion = true;
    let validForm = true;

    // Validate custom job name
    let validCustomJobName = !this.shadowRoot.getElementById('custom-job-name').invalid;
    validForm = validForm && criterion;

    // Validate email
    criterion = this.validEmail || !this.shadowRoot.getElementById('send-email').checked;
    validForm = validForm && criterion;

    // Validate output file
    criterion = this.validOutputFile.valid;
    validForm = validForm && criterion;

    // Form is valid if performing a quick query
    validForm = validForm || this.quickQuery;

    // Dim the other text for consistency if quick query
    this.shadowRoot.getElementById('options-controls').style.color = this.quickQuery ? 'lightgray' : 'black';

    // Enable/disable submit button
    if (this.refreshStatusIntervalId === 0) {
      this.submit_disabled = !validForm;
    }
  }

  _checkSyntax(event) {
    const Url=config.backEndUrl + "page/db-access/check";
    /* Removing comments from query string */
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    var query_lines = this.editor.doc.getValue().split('\n');
    let query = '';
    var i;
    for (i = 0; i < query_lines.length; i++) {
      if (query_lines[i].startsWith('--') == false && query_lines[i] !== "") {
        query += ' ' + query_lines[i];
      }
    }
    var body = {
      job: 'query',
      username: this.username,
      query: query,
      check: true
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
      if (data.status === "ok") {
        // console.log(JSON.stringify(data));
        if (data.valid) {
          this.shadowRoot.getElementById('toast-job-success').text = 'Query syntax is valid';
          this.shadowRoot.getElementById('toast-job-success').show();
        } else {
          this.shadowRoot.getElementById('toast-job-failure').text = 'Query syntax is invalid';
          this.shadowRoot.getElementById('toast-job-failure').show();
        }
      } else {
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error checking query syntax';
        this.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
    });
  }

  _submitJob(callback) {
    const Url=config.backEndUrl + "job/submit";

    /* Removing comments from query string */
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    var query_lines = this.editor.doc.getValue().split('\n');
    let query = '';
    var i;
    for (i = 0; i < query_lines.length; i++) {
      if (query_lines[i].startsWith('--') == false && query_lines[i] !== "") {
        query += ' ' + query_lines[i];
      }
    }
    var body = {
      job: 'query',
      username: this.username,
      query: query,
    };
    if (this.quickQuery) {
      body.quick = "true";
    }
    if (this.shadowRoot.getElementById('send-email').checked) {
      body.email = this.email;
    }
    if (this.customJobName !== '') {
      body.job_name = this.customJobName;
    }
    const param = {
      method: "PUT",
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
        this.shadowRoot.getElementById('toast-job-success').text = 'Job submitted';
        this.shadowRoot.getElementById('toast-job-success').show();
        if (this.quickQuery) {
          // TODO: Set up polling of status until results are fetched.
          this._pollQuickQueryResult(data.jobid);
        }
      } else {
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error submitting job';
        this.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
      callback();
    });

  }

  _pollQuickQueryResult(jobId) {

    if (this.refreshStatusIntervalId === 0) {
      let pollStartTime = Date.now();
      this.refreshStatusIntervalId = window.setInterval(() => {
        if (Date.now() - pollStartTime < 40*1000) {
          this._getJobStatus(jobId);
        } else {
          window.clearInterval(this.refreshStatusIntervalId);
          this.refreshStatusIntervalId = 0;
          this._toggleSpinner(false, () => {});
          this.shadowRoot.getElementById('toast-job-failure').text = 'Quick query timeout.';
          this.shadowRoot.getElementById('toast-job-failure').show();
        }
      }, 3000);
    }
  }

  _getJobStatus(jobId) {
    const Url=config.backEndUrl + "job/status"
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
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        if (data.jobs[0].job_status == 'success' || data.jobs[0].job_status == 'failure') {
          window.clearInterval(this.refreshStatusIntervalId);
          this.refreshStatusIntervalId = 0;
          this._toggleSpinner(false, () => {});
          if (data.jobs[0].job_status == 'success') {
            let results = JSON.parse(data.jobs[0].data);
            this.results = JSON.stringify(results);
            this._displayQuickQueryResults(results);
          } else {
            this.results = '';
            this.shadowRoot.getElementById('results-textarea-container').innerHTML = '';
            this.shadowRoot.getElementById('results-textarea-container').style.display = 'none';
            this.shadowRoot.getElementById('toast-job-failure').text = 'Quick query failed.';
            this.shadowRoot.getElementById('toast-job-failure').show();
          }
        }
        //TODO: Display results
      } else {
        console.log(JSON.stringify(data));
      }
    });
  }

  _displayQuickQueryResults(results){
    // Generate an array of vaadin-grid column elements based on the keys of the first object in the array
    let columnElements = [];
    for (var key in results[0]) {
      columnElements.push(html`
        <vaadin-grid-sort-column path="${key}" header="${key}"></vaadin-grid-sort-column>
      `);
    }
    // Inject a vaadin-grid element into the results container
    let resultsContainer = this.shadowRoot.getElementById('results-textarea-container');
    let container = resultsContainer.firstElementChild;
    if (!container) {
      container = resultsContainer.appendChild(document.createElement('div'));
    }
    render(
      html`
        <h3>Quick query results:</h3>
        <vaadin-grid .multiSort="${true}">
          ${columnElements}
        </vaadin-grid>
      `,
      container
    );
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    // Populate the grid data with the input `results` array
    // Apply class names for styling
    grid.cellClassNameGenerator = function(column, rowData) {
      let classes = '';
      classes += ' monospace-column';
      return classes;
    };
    grid.items = results;
    grid.recalculateColumnWidths();
    grid.generateCellClassNames();
    this.shadowRoot.getElementById('results-textarea-container').style.display = 'block';
  }

  _toggleSpinner(active, callback) {
    this.submit_disabled = active;
    this.shadowRoot.getElementById('submit-button-query').disabled = this.submit_disabled;
    this.shadowRoot.getElementById('submit-spinner').active = active;
    callback();
  }

  _submit(event) {
    if (!this.submit_disabled) {
      this._toggleSpinner(true, () => {
        this._submitJob(() => {
          this._toggleSpinner(this.quickQuery, () => {});
        });
      });
    }
  }

  _queryExampleRenderer(root, dialog) {
    let container = root.firstElementChild;
    if (container) {
      // The wc-codemirror element creates duplicate boxes with repeated dialog
      // openings. Removing the DOM element each time the dialog is opened bypasses
      // this issue.
      root.removeChild(root.childNodes[0]);
    }
    container = root.appendChild(document.createElement('div'));
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    viewportHeight = viewportHeight === 0 ? 1000 : viewportHeight;
    render(
      html`
      <style>
        .CodeMirror {
          height: 24rem;
          font-size: 0.8rem;
        }
      </style>
      <div style="overflow-x: auto; overflow-y: auto; height: ${0.9*viewportHeight}px; width: 1000px;">
        <a title="Close" href="#" onclick="return false;">
          <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 4rem; color: darkgray;"></iron-icon>
        </a>
        <h3>Sample Basic information
        <a title="Copy query to editor" href="#" onclick="return false;">
          <iron-icon id="copy-example-0" icon="vaadin:copy-o" style="color: darkblue; padding-left: 2rem;"></iron-icon>
        </a></h3>
        <div id="query-example-0" class="query-input-box" style="border: 1px solid #CCCCCC;">
          <wc-codemirror id="query-example-editor-0" mode="sql" src="images/example-query-0.sql"></wc-codemirror>
        </div>
        <h3>Limit Basic information by region and number of rows
        <a title="Copy query to editor" href="#" onclick="return false;">
          <iron-icon id="copy-example-1" icon="vaadin:copy-o" style="color: darkblue; padding-left: 2rem;"></iron-icon>
        </a></h3>
        <div id="query-example-1" class="query-input-box" style="border: 1px solid #CCCCCC;">
          <wc-codemirror id="query-example-editor-1" mode="sql" src="images/example-query-1.sql"></wc-codemirror>
        </div>
        <h3>Select stars from M2 Globular Cluster
        <a title="Copy query to editor" href="#" onclick="return false;">
          <iron-icon id="copy-example-2" icon="vaadin:copy-o" style="color: darkblue; padding-left: 2rem;"></iron-icon>
        </a></h3>
        <div id="query-example-2" class="query-input-box" style="border: 1px solid #CCCCCC;">
          <wc-codemirror id="query-example-editor-2" mode="sql" src="images/example-query-2.sql"></wc-codemirror>
        </div>
      </div>
      `,
      container
    );

    var ivlIds = [0,0,0];
    for (let editorId in [0, 1, 2]) {
      // console.log(`Trying to set format (${editorId})...`);
      ivlIds[editorId] = window.setInterval(() => {
        // console.log(`    intervalId: ${ivlIds[editorId]}`);
        var editorElement = document.getElementById(`query-example-editor-${editorId}`).querySelector('.CodeMirror');
        if (editorElement !== null) {
          // console.log(editorElement);
          this.editor = editorElement.CodeMirror;
          this.editor.doc.cm.setOption('lineNumbers', false);
          editorElement.style['height'] = 'auto';
          document.getElementById(`copy-example-${editorId}`).addEventListener('click', (e) => {
            this._copyQueryToDbAccessPage(e);
            dialog.opened = false;
          });
          window.clearInterval(ivlIds[editorId]);
        }
      }, 200);
    }
  }

  _copyQueryToDbAccessPage(event) {
    // query = query.replace(/(  )+/g, '\n');
    // console.log(`queryidx: ${queryIdx}`);
    // console.log(event.target.id);
    switch (event.target.id) {
      case "copy-example-0":
        var query = `--
-- Example Query --
-- This query selects 0.001% of the data and returns only five rows
SELECT RA, DEC, MAG_AUTO_G, TILENAME
FROM Y3_GOLD_2_2 sample(0.001)
FETCH FIRST 5 ROWS ONLY
`
        break;
      case "copy-example-1":
        var query = `--
-- Example Query --
-- This query selects the first 1000 rows from a RA/DEC region
SELECT ALPHAWIN_J2000 RAP,DELTAWIN_J2000 DECP, MAG_AUTO_G, TILENAME
FROM Y3_GOLD_2_2
WHERE
RA BETWEEN 40.0 and 41.0 and
DEC BETWEEN -41 and -40 and
ROWNUM < 1001
`
        break;
      case "copy-example-2":
        var query = `--
-- Example Query --
-- This query selects stars around the center of glubular cluster M2
SELECT
  COADD_OBJECT_ID,RA,DEC,
  MAG_AUTO_G G,
  MAG_AUTO_R R,
  WAVG_MAG_PSF_G G_PSF,
  WAVG_MAG_PSF_R R_PSF
FROM Y3_GOLD_2_2
WHERE
   RA between 323.36-0.12 and 323.36+0.12 and
   DEC between -0.82-0.12 and -0.82+0.12 and
   WAVG_SPREAD_MODEL_I + 3.0*WAVG_SPREADERR_MODEL_I < 0.005 and
   WAVG_SPREAD_MODEL_I > -1 and
   IMAFLAGS_ISO_G = 0 and
   IMAFLAGS_ISO_R = 0 and
   SEXTRACTOR_FLAGS_G < 4 and
   SEXTRACTOR_FLAGS_R < 4
`
        break;
      default:
        var query = '';
        break;
    }
    // console.log(`Updating query to ${query}`);
    store.dispatch(updateQuery(query));
    // store.dispatch(loadPage('db-access', this.accessPages));
    // dialog.opened = false;
  }


  _updateQueryEditorValue(query) {
    var queryInitIntervalId = window.setInterval(() => {
      // console.log(`Query changed to\n${this.query}`);
      let editorElement = this.shadowRoot.getElementById('query-input-editor').querySelector('.CodeMirror');
      if (editorElement !== null) {
        if (this.query !== '') {
          // console.log(`Updating code editor...`);
          this.editor = editorElement.CodeMirror;
          this.editor.doc.setValue(this.query);
        }
        window.clearInterval(queryInitIntervalId);
      }
    }, 100);
  }

  stateChanged(state) {
    this.username = state.app.username;
    if (this.query !== state.app.query) {
      this.query = state.app.query;
      this._updateQueryEditorValue(this.query);
    }
    this.db = state.app.db;
    this.email = this.email === '' ? state.app.email : this.email;

  }

  firstUpdated() {
    const dialog = this.shadowRoot.getElementById('query-examples-dialog');
    dialog.renderer = this._queryExampleRenderer;
    this.shadowRoot.getElementById('query-examples-button').addEventListener('click', function() {
      dialog.opened = true;
    });
    this.shadowRoot.getElementById('check-syntax-button').addEventListener('click', () => {
      this._checkSyntax();
    });
    var queryInitIntervalId = window.setInterval(() => {
      if (this.shadowRoot.querySelector('.CodeMirror') !== null) {
        this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
        if (this.query !== '') {
          this.editor.doc.setValue(this.query);
        } else {
          this.query = this.editor.doc.getValue();
        }
        window.clearInterval(queryInitIntervalId);
      }
    }, 200);

  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'submit_disabled':
          this.shadowRoot.getElementById('submit-button-query').disabled = this.submit_disabled;
          break;
        case 'quickQuery':
          this._validateOutputFile();
        case 'email':
          this._validateEmail();
        case 'customJobName':
          this._validateCustomJobName();
        case 'query':
          this._updateQueryEditorValue(this.query);
        default:
          // Assume that we want to revalidate the form when a property changes
          this._validateForm();
      }
    });
  }

}
window.customElements.define('des-db-access', DESDbAccess);
