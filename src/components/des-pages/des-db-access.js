import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vanillawc/wc-codemirror/index.js';
import '@vanillawc/wc-codemirror/mode/sql/sql.js';


class DESDbAccess extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _value: { type: Number },
      username: {type: String},
      query: {type: String},
      msg: {type: String},
      submit_disabled: {type: Boolean},
      validEmail: {type: Boolean},
      validOutputFile: {type: Object},
      validCompression: {type: Boolean},
      compressChecked: {type: Boolean}
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

        @media all and (min-width: 1000px) {

          .query-container {
            grid-template-columns: 60% 40%;
          }
        }

        .query-row-2 {
            @apply(--layout-horizontal);
            @apply(--layout-around-justified);

        }

        .query-left {
            border: 1px solid #CCCCCC;
        }

        .query-btn {
            @apply(--layout-vertical);
            @apply(--layout-flex-4);
            text-align: center;
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
        `,
    ];
  }


  constructor(){
    super();
    this.username = '';
    this.query = '';
    this.msg = "";
    this.submit_disabled = true;
    this.validEmail = false;
    this.validOutputFile = {file: '',valid: false};
    this.compressChecked = false;
    this.validCompression = false;
  }

  queryBox() {
    return html`
      <div class="query-left">
          <div id="queryBox">
              <wc-codemirror mode="sql" src="src/components/des-pages/example-query.sql"></wc-codemirror>
          </div>
      </div>

    `
  }

  queryControls() {
    return html`
      <div class="query-right">
        <table class="query-table" id="query-table">
            <col width="70%">
            <col width="30%">
            <tr class="query-tr">
                <td class="query-td-2">
                    <div class="query-btn">
                        <div class="btn-wrap">
                            <paper-button id="subQuery" class="indigo medium" raised disabled @tap="${this._submitQuery}">Submit Job</paper-button>
                        </div>

                        <div class="btn-wrap">
                            <paper-button class="indigo medium" raised @tap="${this._clearQueryBox}">Clear</paper-button>

                        </div>

                        <div class="btn-wrap">
                            <paper-button class="indigo medium" raised @tap="${this._checkSyntax}">Check</paper-button>
                        </div>

                        <div class="btn-wrap">
                            <paper-button id="QuickQuery" class="indigo medium" raised @tap="${this._quickSubmit}">Quick</paper-button>
                        </div>

                        <div class="btn-wrap">
                            <a href = "/easyweb/db-examples" style="text-decoration: none;" tabindex="-1">
                                <paper-button class="indigo medium" raised >See Examples</paper-button>
                            </a>
                        </div>
                    </div>
                </td>
                <td class="query-td">
                    <div class="btn-wrap">
                        <paper-spinner id="querySpinner" class="big"></paper-spinner>
                    </div>
                </td>
            </tr>
            <tr>
            <td>
                <br />
            </td>
            </tr>
            <tr class="query-tr" >
                <td class="query-td" colspan="2">
                    <span>Output file (.csv, .fits or .h5).</span>
                </td>
            </tr>
            <tr class="query-tr">
                <td class="query-td">
                    <paper-input style="margin-left:13px; margin-bottom: 14px; margin-top: -10px;" id="inputOutputFile" @change="${this._validateOutputFile}"  label="Output file" ></paper-input>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td">
                    <span style="color: red;">Options:</span>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                <input type="checkbox" id="compress" name="compress" ?checked="${this.compressChecked}"
                @change="${this._updateCompressChecked}"/>Compress files (.csv and .h5 only).
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-input  id="queryname" name="name" label="Job Name (optional)" value="" style="margin-top: -10px"></paper-input>
                </td>

            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-input  id="email" name="email" label="Email" value="" @change="${this._validateEmail}" style="margin-top: -10px"></paper-input>
                </td>
            </tr>
        </table>
      </div>
    `
  }

  render() {
    return html`

      <div class="content">
          Insert your query in the box below. Data results for "Quick" Jobs (30 sec.) will be displayed at the bottom.
      </div>
      <div class="query-container">
        ${this.queryBox()}
        ${this.queryControls()}
      </div>
    `;
  }
  
  _updateCompressChecked(e){
    this.compressChecked = e.target.checked;
  }
  _clearQueryBox(){
    this.query = '';
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    console.log(this.editor)
    this.editor.setValue('-- Insert Query --\n\n');
    this.editor.focus();
    this.editor.execCommand('goLineDown');
  }

  _validateOutputFile(){
    const outputfile = this.shadowRoot.getElementById('inputOutputFile').value
    if (outputfile.endsWith('.csv') || outputfile.endsWith('.h5') || outputfile.endsWith('.fits')){
      this.validOutputFile = {file: outputfile,valid: true}
    } 
    else { 
      this.validOutputFile = {file: outputfile, valid: false}
    }
  }

  _validateSyntax(){
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    this.query = this.editor.getValue();
  }

  _validateEmail(){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = re.test(String(this.shadowRoot.getElementById('email').value).toLowerCase()); 
    if (validEmail){
      this.validEmail = true
    }
    else{
      this.validEmail = false
    }
  }

  _validateForm() {

    const outputfile = this.shadowRoot.getElementById('inputOutputFile').value
    if (this.compressChecked == false){
      this.validCompression = true
    }
    else if (this.compressChecked && (outputfile.endsWith('.csv') || outputfile.endsWith('.h5'))){
      this.validCompression = true
    }
    else { this.validCompression = false }

   
    var validForm = (this.validEmail && this.validOutputFile.valid && this.validCompression)
    // Enable/disable submit button
    this.submit_disabled = !validForm;
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = state.app.email;
  }
  
  _quickSubmit(){
    console.log("_quickSubmit");
    const Url=config.backEndUrl + config.apiPath +  "/job/submit";
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    this.query = this.editor.doc.getValue();
    var body = {
      job: 'query',
      username: this.username,
      query: this.query,
      msg: this.msg,
      quick: 'true'
    };
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
      } else {
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error submitting job';
        this.shadowRoot.getElementById('toast-job-failure').show();
      }
      console.log(JSON.stringify(data));
      callback();
    });
  }

  _submitQuery(){
    this.editor = this.shadowRoot.querySelector('.CodeMirror').CodeMirror;
    this.query = this.editor.doc.getValue();

    if (this.shadowRoot.getElementById('inputOutputFile').valid = true){
         }
    
  }

  updated(changedProps) {
    this._validateForm();
    if (this.submit_disabled){
      this.shadowRoot.getElementById('subQuery').disabled = true
    }
    else {
      this.shadowRoot.getElementById('subQuery').disabled = false
    }
    
  }

}
window.customElements.define('des-db-access', DESDbAccess);
