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
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-slider/paper-slider.js';
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
      positions: {type: String},
      rgb_bands: {type: Object},
      fits_bands: {type: Object},
      rgb_types_stiff: {type: Boolean},
      rgb_types_lupton: {type: Boolean},
      fits_all_toggle: {type: Boolean},
      fits: {type: Boolean},
      submit_disabled: {type: Boolean}
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

        `,
    ];
  }


  constructor(){
    super();
    this.username = '';
    this.query = '';
    this.msg = "";
    this.positions = "";
    this.tabIdx = 0;
    this.csvFile = '';
    this.rgb_bands = {
      "checked": {
        "g": false,
        "r": false,
        "i": false,
        "z": false,
        "y": false
      },
      "disabled": {
        "g": true,
        "r": true,
        "i": true,
        "z": true,
        "y": true
      }
    };
    this.fits_bands = {
      "checked": {
        "g": false,
        "r": false,
        "i": false,
        "z": false,
        "y": false
      }
    };

    this.fits = false;
    this.rgb_types_stiff = false;
    this.rgb_types_lupton = false;
    this.fits_all_toggle = false;
    this.submit_disabled = true;
  }

  render() {
    return html`

    <section>
        <h2>Positions and data set</h2>
        <div>
          <label id="data-release-tag">Data release tag:</label>
          <paper-radio-group selected="Y6A1" aria-labelledby="data-release-tag">
            <paper-radio-button name="Y6A1">Y6A1</paper-radio-button>
            <paper-radio-button name="Y3A2">Y3A2</paper-radio-button>
            <paper-radio-button name="Y1A1">Y1A1</paper-radio-button>
            <paper-radio-button name="SVA1">SVA1</paper-radio-button>
          </paper-radio-group>
        </div>
        <div>
          <paper-tabs id="tab-selector" selected="${this.tabIdx}" @click="${this._updateTabbedContent}">
            <paper-tab>by COADD ID</paper-tab>
            <paper-tab>by RA/DEC coordinates</paper-tab>
          </paper-tabs>

          <iron-pages selected="${this.tabIdx}">
              <div>
                  <iron-autogrow-textarea style="font-family: monospace;" id="coadd-id-textarea" max-rows="10" rows=4 placeholder="COADD_OBJECT_ID\n61407318\n61407582" value=""></iron-autogrow-textarea>
              </div>
              <div>
                  <iron-autogrow-textarea style="font-family: monospace;" id="coords-textarea" max-rows="10" rows=4 placeholder="RA,DEC\n21.5,3.48\n36.6,-15.68" value=""></iron-autogrow-textarea>
              </div>
          </iron-pages>
        </div>
        <div>
          <div>
            &nbsp;&nbsp;
            <paper-button raised class="indigo" id="bc_uploadFile">
              <span style="overflow-x: auto; overflow-wrap: break-word;">Upload CSV file</span>
              <input type="file" class="upload" id="csv-upload" @change="${e => this._fileChange(e)}" accept=".csv, .CSV" />
            </paper-button>
          </div>
          <div id="csv-file-msg"></div>
        </div>
    </section>

    <section>
        <h2>Output format and size</h2>
        <p>Check all desired output files. FITS format requires selection of one or more bands. RGB color images require selection of exactly three bands.</p>
        <h3>FITS format</h3>
        <div style="float: none;">
        <p>FITS format requires selection of one or more bands.</p>
        <paper-checkbox @change="${e => this._updateFitsBands(e)}" ?checked="${this.fits}">FITS (FITS format)</paper-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
        <paper-checkbox @change="${e => this._selectAllFitsBands(e)}" ?checked="${this.fits_all_toggle}" ?disabled="${!this.fits}" style="font-weight: bold;" id="bc_all_toggle">Select All/None</paper-checkbox>&nbsp;
        </div>
        <div style="float: none;">
          &nbsp;
          &nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'g')}" ?checked="${this.fits_bands.checked.g}" ?disabled="${!this.fits}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'r')}" ?checked="${this.fits_bands.checked.r}" ?disabled="${!this.fits}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'i')}" ?checked="${this.fits_bands.checked.i}" ?disabled="${!this.fits}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'z')}" ?checked="${this.fits_bands.checked.z}" ?disabled="${!this.fits}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'y')}" ?checked="${this.fits_bands.checked.y}" ?disabled="${!this.fits}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;

        </div>
        <h3>Color image format</h3>
        <p>RGB color images require selection of exactly three bands.</p>
        <div>
          <paper-checkbox @change="${e => this._updateRgbTypes(e, 'stiff')}" ?checked="${this.rgb_types_stiff}">Color image (RGB: STIFF format)</paper-checkbox>
        </div>
        <div>
          <paper-checkbox @change="${e => this._updateRgbTypes(e, 'lupton')}" ?checked="${this.rgb_types_lupton}">Color image (RGB: Lupton method)</paper-checkbox>
        </div>

        <div style="float: none;">
          &nbsp;
          &nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'g')}" ?checked="${this.rgb_bands.checked.g}" ?disabled="${this.rgb_bands.disabled.g}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'r')}" ?checked="${this.rgb_bands.checked.r}" ?disabled="${this.rgb_bands.disabled.r}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'i')}" ?checked="${this.rgb_bands.checked.i}" ?disabled="${this.rgb_bands.disabled.i}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'z')}" ?checked="${this.rgb_bands.checked.z}" ?disabled="${this.rgb_bands.disabled.z}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'y')}" ?checked="${this.rgb_bands.checked.y}" ?disabled="${this.rgb_bands.disabled.y}" class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;
        </div>
        <h3>Cutout size (arcminutes)</h3>
        <div>
          X &nbsp;<paper-slider id="bc_xsizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="1.0" expand editable></paper-slider>
          Y &nbsp;<paper-slider id="bc_ysizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="1.0" expand editable></paper-slider>
        </div>
    </section>
    <section>
        <h2>Options</h2>
        <div>
          <p>Provide a custom job name:</p>
          <paper-input always-float-label id="bc_validname" name="name" label="Job Name" value="" style = "max-width: 500px; padding-left:2rem;"></paper-input>
          <p>Receive an email when the files are ready for download:</p>
          <paper-checkbox style="font-size:16px; padding-left:2rem; padding-top:15px;" id="bc_send_email">Email when complete</paper-checkbox>&nbsp;&nbsp;
        </div>
    </section>
    <section>
    <div>
      <paper-button raised  class="indigo"  id="bc_submitJobButton" ?disabled="${this.submit_disabled}" on-tap="_submitJob">
        <i class="fa fa-cogs"></i> &nbsp;  &nbsp;Submit Job
      </paper-button>
    </div>
    </section>
    `;
  }

  _validateForm() {
    var validForm = true;
    validForm = this.positions !== "" && validForm;
    validForm = (this.fits || this.rgb_types_stiff || this.rgb_types_lupton) && validForm;
    if (this.fits) {
      validForm = this._bandsSelected(this.fits_bands) > 0 && validForm;
    }
    if (this.rgb_types_stiff || this.rgb_types_lupton) {
      validForm = this._bandsSelected(this.rgb_bands) === 3 && validForm;
    }
    // Enable/disable submit button
    this.submit_disabled = !validForm;
  }
  _bandsSelected(obj) {
    var bandsSelected = 0;
    for (var b in obj.checked) {
      if (obj.checked[b]) {
        bandsSelected += 1;
      }
    }
    return bandsSelected
  }
  _updateRgbTypes(event, type) {
    if (type === 'stiff') {
      this.rgb_types_stiff = event.target.checked;
    } else {
      this.rgb_types_lupton = event.target.checked;
    }
    if (this.rgb_types_lupton === false && this.rgb_types_stiff === false) {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = true;
      }
    } else {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
    }
  }

  _selectAllFitsBands(event) {
    for (var b in this.fits_bands.checked) {
      this.fits_bands.checked[b] = event.target.checked;
    }
    this.fits_all_toggle = event.target.checked;
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;
  }

  _updateFitsBands(event) {
    this.fits = event.target.checked;
    for (var b in this.fits_bands.disabled) {
      this.fits_bands.disabled[b] = !this.fits;
    }
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;

  }

  _updateFitsBandsSelection(event, band) {
    this.fits_bands.checked[band] = event.target.checked;
    console.log('fits toggle: ' + this.fits_all_toggle);
    if (this.fits_bands.checked[band] === false) {
      console.log('unchecked a band');
      this.fits_all_toggle = false;
    } else {
      var allChecked = true;
      for (var b in this.fits_bands.checked) {
        allChecked = allChecked && this.fits_bands.checked[b];
      }
      this.fits_all_toggle = allChecked;
    }
    //This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.fits_bands;
    this.fits_bands =  {};
    this.fits_bands =  temp;
    console.log(JSON.stringify(this.fits_bands));

  }

  _updateRgbSelection(event, band) {
    // event.target.disabled = true
    // console.log('checked: '+ event.target.checked)
    // console.log('disabled: '+ event.target.disabled)
    // console.log(band)
    this.rgb_bands.checked[band] = event.target.checked;
    var numChecked = 0;
    for (var b in this.rgb_bands.checked) {
      if (this.rgb_bands.checked[b]) {
        numChecked += 1;
      }
    }
    // console.log('numChecked = ' + numChecked);
    if (numChecked > 2) {
      for (var b in this.rgb_bands.disabled) {
        if (!this.rgb_bands.checked[b]) {
          console.log('disabling ' + b);
          this.rgb_bands.disabled[b] = true;
        }
      }
    } else {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
    }
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.rgb_bands;
    this.rgb_bands =  {};
    this.rgb_bands =  temp;

    console.log(JSON.stringify(this.rgb_bands))
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
        that.positions = data.csv;
        that.shadowRoot.getElementById('csv-file-msg').innerHTML = 'Positions validated and processed.';
        that.shadowRoot.getElementById('csv-file-msg').style.color = 'green';
      } else {
        that.shadowRoot.getElementById('csv-file-msg').innerHTML = data.msg;
        that.shadowRoot.getElementById('csv-file-msg').style.color = 'red';
      }
    })
  }
  stateChanged(state) {
    this.username = state.app.username;
  }

  _updateTabbedContent(event) {
    this.tabIdx = this.shadowRoot.getElementById('tab-selector').selected;
  }

  // firstUpdated() {
  //   console.log('First Updated: '+ JSON.stringify(this.rgb_bands.checked));
  // }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
    this._validateForm();
  }
}

window.customElements.define('des-cutout', DESCutout);
