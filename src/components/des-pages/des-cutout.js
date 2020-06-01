import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';


class DESCutout extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _value: { type: Number },
      username: {type: String},
      query: {type: String},
      msg: {type: String},
      tabIdx: { type: Number },
      csvFile: {type: String},
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`

          /* coadd table layout */
          table#coadd-table {
              /*border: 1px solid #ddd;*/
          }

          th.coadd-th, td.coadd-td {
              padding: 5px;
              text-align: left;
              border: 1px solid white;
              vertical-align: middle;
          }

          td.coadd-td:nth-child(odd) {
              background: linear-gradient(to right, #efeaf4, white);
          }

          .caption {
              padding-left: 15px;
              color: #a0a0a0;
          }
          .upload{
              position: absolute;
              opacity: 0;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              /*border: 2px dotted #8da6ce;*/
              /*border-style: outset;*/
          }
          .card-content {
              @apply(--layout-vertical);
          }
          .coadd-container {
              margin-top: 10px;
              @apply(--layout-horizontal);
          }
          .container2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
          }
          .container3 {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .left {
              @apply(--layout-flex);
          }
          .left2 {
              @apply(--layout-flex);
              text-align: center;

          }
          .right {
              @apply(--layout-flex);
          }
          .right2 {
              @apply(--layout-flex-2);
              text-align: center;

          }

          .mid {
              @apply(--layout-flex);
          }
          .flex3child {
              @apply(--layout-flex-3);
          }
          .flex4child {
              @apply(--layout-flex-4);
          }

          paper-slider {
              width: 100%;
          }

          hr {
              display: block;
              border: 1px solid gray;
              opacity: 0.2;

          }

          paper-icon-item {
              /*background: linear-gradient(to right, #efeaf4, white);*/
          }

          .buttonLook{
              border: 4px solid #ccc;
              border-style: outset;
              border-radius: 10px;
          }
          .btcell {
              text-align: center;
          }

          .around-cell {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .around-cell2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
          }

          #csv-file-msg {
            color: red;
          }
        `,
    ];
  }


  constructor(){
    super();
    this.username = '';
    this.query = '';
    this.msg = "";
    this.tabIdx = 0;
    this.csvFile = '';
  }

  render() {
    return html`

    <section>

        <paper-tabs id="tab-selector" selected="${this.tabIdx}" @click="${this._updateTabbedContent}">
          <paper-tab>by COADD ID</paper-tab>
          <paper-tab>by RA/DEC coordinates</paper-tab>
        </paper-tabs>

        <iron-pages selected="${this.tabIdx}">
            <div>
                <iron-autogrow-textarea id="coadd-id-textarea" max-rows="15" rows=12 placeholder="COADD_OBJECT_ID\n61407318\n61407582" value=""></iron-autogrow-textarea>
            </div>
            <div>
                <iron-autogrow-textarea id="coords-textarea" max-rows="15" rows=12 placeholder="RA,DEC\n21.5,3.48\n36.6,-15.68" value=""></iron-autogrow-textarea>
            </div>
        </iron-pages>

        <input type="file" id="csv-upload" @change="${e => this._fileChange(e)}" accept=".csv, .CSV" />
        <div id="csv-file-msg"></div>

    </section>
    `;
  }

  _fileChange(event) {
    this.csvFile = this.shadowRoot.getElementById('csv-upload').files[0];
    var reader = new FileReader();
    var that = this;
    reader.onload = function(e) {
      var text = reader.result;
      that._validateCsvFile(text)
    }
    reader.readAsText(this.csvFile);
  }

  _validateCsvFile(csvText) {
    const Url=config.backEndUrl + config.apiPath +  "/page/cutout/csv/validate"
    const param = {
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        csvText: csvText,
      }),
      method: "POST"
    };
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        if (data.type === "coords") {
          var textareaID = 'coords-textarea'
          that.tabIdx = 1
        } else {
          var textareaID = 'coadd-id-textarea'
          that.tabIdx = 0
        }
        that.shadowRoot.getElementById(textareaID).value = data.csv;
          that.shadowRoot.getElementById('csv-file-msg').innerHTML = '';
      } else {
        that.shadowRoot.getElementById('csv-file-msg').innerHTML = data.msg;
      }
    })
  }
  stateChanged(state) {
    this.username = state.app.username;
  }

  _updateTabbedContent(event) {
    this.tabIdx = this.shadowRoot.getElementById('tab-selector').selected;
  }

}

window.customElements.define('des-cutout', DESCutout);
