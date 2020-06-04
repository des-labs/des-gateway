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
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';


class DESCutout extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
          h2 {
            text-align: left;
            font-size: 1.5rem;
          }
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

          #rgb_bands_selector: {
            display: none;
          }

          #fits_bands_selector: {
            display: none;
          }

          .toast-position {
              /* right: 50%; */
          }
          .toast-error {
            --paper-toast-color: #FFD2D2 ;
            --paper-toast-background-color: #D8000C;
          }
          .toast-success {
            --paper-toast-color:  #DFF2BF;
            --paper-toast-background-color: #4F8A10;
          }
          .invalid-form-element {
            color: red;
            border-color: red;
            border-width: 1px;
            border-style: dashed;
          }
        `,

    ];
  }

  static get properties() {
    return {
      _value: { type: Number },
      username: {type: String},
      email: {type: String},
      db: {type: String},
      msg: {type: String},
      tabIdx: { type: Number },
      xsize: { type: Number },
      ysize: { type: Number },
      csvFile: {type: String},
      positions: {type: String},
      customJobName: {type: String},
      release: {type: String},
      validEmail: {type: Boolean},
      rgb_bands: {type: Object},
      fits_bands: {type: Object},
      rgb_types_stiff: {type: Boolean},
      rgb_types_lupton: {type: Boolean},
      fits_all_toggle: {type: Boolean},
      fits: {type: Boolean},
      submit_disabled: {type: Boolean}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.email = '';
    this.db = '';
    this.msg = "";
    this.positions = "";
    this.tabIdx = 0;
    this.csvFile = '';
    this.customJobName = '';
    this.validEmail = false;
    this.fits = false;
    this.rgb_types_stiff = false;
    this.rgb_types_lupton = false;
    this.fits_all_toggle = false;
    this.submit_disabled = true;
    this.xsize = 1.0
    this.ysize = 1.0
    this.release = "Y6A1"
    this.rgb_bands = {
      "checked": {
        "g": true,
        "r": true,
        "i": true,
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
        "g": true,
        "r": true,
        "i": true,
        "z": false,
        "y": false
      }
    };
  }

  render() {
    return html`

    <section>
        <h2>Positions and data set</h2>
        <div>
          <label id="data-release-tag">Data release tag:</label>
          <paper-radio-group selected="${this.release}" aria-labelledby="data-release-tag">
            <paper-radio-button @change="${e => this.release = e.target.name}" name="Y6A1">Y6A1</paper-radio-button>
            <paper-radio-button @change="${e => this.release = e.target.name}" name="Y3A2">Y3A2</paper-radio-button>
            <paper-radio-button @change="${e => this.release = e.target.name}" name="Y1A1">Y1A1</paper-radio-button>
            <paper-radio-button @change="${e => this.release = e.target.name}" name="SVA1">SVA1</paper-radio-button>
          </paper-radio-group>
        </div>
        <div>
          <paper-tabs id="tab-selector" selected="${this.tabIdx}" @click="${e => this._updateTabbedContent(e)}">
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
            <span id="csv-file-msg" style="padding-left: 2rem;"></span>
          </div>

        </div>
    </section>

    <section>
        <h2>Output format and size</h2>
        <p>Check all desired output files. FITS format requires selection of one or more bands. RGB color images require selection of exactly three bands.</p>
        <h3>FITS format</h3>
        <div style="float: none;">
        <p>FITS format requires selection of <span id="criterion-fits-band-selected">one or more bands</span>.</p>
        <paper-checkbox @change="${e => this._updateFitsBands(e)}" ?checked="${this.fits}">FITS (FITS format)</paper-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;

        </div>
        <div id="fits_bands_selector">
          Bands: &nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'g')}" ?checked="${this.fits_bands.checked.g}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'r')}" ?checked="${this.fits_bands.checked.r}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'i')}" ?checked="${this.fits_bands.checked.i}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'z')}" ?checked="${this.fits_bands.checked.z}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateFitsBandsSelection(e, 'y')}" ?checked="${this.fits_bands.checked.y}" ?disabled="${!this.fits}" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox id="select-all-bands-toggle" @change="${e => this._selectAllFitsBands(e)}" ?checked="${this.fits_all_toggle}" ?disabled="${!this.fits}" style="font-weight: bold; padding-left: 2rem;" id="bc_all_toggle">Select All/None</paper-checkbox>&nbsp;
        </div>
        <h3>Color image format</h3>
        <p>RGB color images require selection of <span id="criterion-three-bands">exactly three bands</span>.</p>
        <div>
          <paper-checkbox @change="${e => this._updateRgbTypes(e, 'stiff')}" ?checked="${this.rgb_types_stiff}">Color image (RGB: STIFF format)</paper-checkbox>
        </div>
        <div>
          <paper-checkbox @change="${e => this._updateRgbTypes(e, 'lupton')}" ?checked="${this.rgb_types_lupton}">Color image (RGB: Lupton method)</paper-checkbox>
        </div>

        <div id="rgb_bands_selector" style="display: none;">
          Bands: &nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'g')}" ?checked="${this.rgb_bands.checked.g}" ?disabled="${this.rgb_bands.disabled.g}" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'r')}" ?checked="${this.rgb_bands.checked.r}" ?disabled="${this.rgb_bands.disabled.r}" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'i')}" ?checked="${this.rgb_bands.checked.i}" ?disabled="${this.rgb_bands.disabled.i}" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'z')}" ?checked="${this.rgb_bands.checked.z}" ?disabled="${this.rgb_bands.disabled.z}" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>&nbsp;&nbsp;
          <paper-checkbox @change="${e => this._updateRgbSelection(e, 'y')}" ?checked="${this.rgb_bands.checked.y}" ?disabled="${this.rgb_bands.disabled.y}" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>&nbsp;&nbsp;
        </div>
        <h3>Cutout size (arcminutes)</h3>
        <div>
          X &nbsp;<paper-slider @change="${e => this.xsize = e.target.value}" id="bc_xsizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="${this.xsize}" expand editable></paper-slider>
          Y &nbsp;<paper-slider @change="${e => this.ysize = e.target.value}" id="bc_ysizeSlider" pin min="0.1" max="12" max-markers="10" step="0.1" value="${this.ysize}" expand editable></paper-slider>
        </div>
    </section>
    <section>
        <h2>Options</h2>
        <div>
          <p>Provide a custom job name:</p>
          <paper-input @change="${(e) => {this.customJobName = e.target.value; console.log(e.target.value);}}" always-float-label id="bc_validname" name="name" label="Job Name" placeholder="My_Custom_Job_Name-12" value="${this.customJobName}" style="max-width: 500px; padding-left:2rem;"></paper-input>
          <p>Receive an email when the files are ready for download:</p>
          <div id="email-options">
            <!-- <p id="email-options-invalid" style="display: none; color: red;">Please enter a valid email address.</p> -->
            <paper-checkbox
              @change="${(e) => {this._updateEmailOption(e)}}"
              style="font-size:16px; padding-left:2rem; padding-top:15px;"
              id="send-email">Email when complete</paper-checkbox>
            <paper-input
              @change="${(e) => {this.email = e.target.value;}}"
              always-float-label
              disabled
              id="custom-email"
              name="name"
              label="Email Address"
              style="max-width: 500px; padding-left:2rem;"
              placeholder="${this.email}"
              value="${this.email}"></paper-input>
          </div>
        </div>
    </section>
    <section>
    <div>
      <paper-button raised  class="indigo"  id="bc_submitJobButton" ?disabled="${this.submit_disabled}" @click="${e => this._submit(e)}">
        Submit Job
      </paper-button>
      <paper-spinner id="submit-spinner" class="big"></paper-spinner>

      <paper-toast class="toast-position toast-success" id="toast-job-success" text="Job has been submitted!" duration="7000"> </paper-toast>
      <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
    </div>
    </section>
    `;
  }

  _updateEmailOption(event) {
    this.shadowRoot.getElementById('custom-email').disabled = !event.target.checked;
    this._validateEmail();
  }

  _toggleSpinner(active, callback) {

    this.submit_disabled = active;
    this.shadowRoot.getElementById('submit-spinner').active = active;
    callback();
  }

  _submit(event) {
    if (!this.submit_disabled) {
      // var that = this;
      this._toggleSpinner(true, () => {
        this._submitJob(() => {
          this._toggleSpinner(false, () => {});
        });
      });
    }
  }

  _submitJob(callback) {
    const Url=config.backEndUrl + config.apiPath +  "/job/submit"
    var body = {
      job: 'cutout',
      username: this.username,
      release: this.release,
      db: this.db,
      positions: this.positions,
      xsize: this.xsize,
      ysize: this.ysize,
      make_fits: this.fits,
      make_rgb_stiff: this.rgb_types_stiff,
      make_rgb_lupton: this.rgb_types_lupton,
      colors_rgb: this._getSelectedBands(this.rgb_bands).join(','),
      colors_fits: this._getSelectedBands(this.fits_bands).join(','),
      // TODO: Implement Lupton RGB format options
      // rgb_minimum: null,
      // rgb_stretch: null,
      // rgb_asinh: null,
      return_list: true
    };
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
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        that.shadowRoot.getElementById('toast-job-success').text = 'Job submitted';
        that.shadowRoot.getElementById('toast-job-success').show();
      } else {
        that.shadowRoot.getElementById('toast-job-failure').text = 'Error submitting job';
        that.shadowRoot.getElementById('toast-job-failure').show();
      }
      console.log(JSON.stringify(data));
      callback();
    });
  }

  _getSelectedBands(bandObj) {
    var bands = [];
    for (var b in bandObj.checked) {
      if (bandObj.checked[b]) {
        bands.push(b);
      }
    }
    return bands;
  }

  _toggleValidWarning(elementId, valid) {
    if (valid) {
      this.shadowRoot.getElementById(elementId).style['font-weight'] = 'normal';
      this.shadowRoot.getElementById(elementId).style.color = 'black';
    } else {
      this.shadowRoot.getElementById(elementId).style['font-weight'] = 'bold';
      this.shadowRoot.getElementById(elementId).style.color = 'red';
    }

  }
  _validateForm() {
    // this.submit_disabled = false;
    // return(true);
    var validForm = true;
    validForm = this.positions !== "" && validForm;
    validForm = (this.fits || this.rgb_types_stiff || this.rgb_types_lupton) && validForm;
    if (this.fits) {
      var criterion = this._bandsSelected(this.fits_bands) > 0
      validForm = criterion && validForm;
      this._toggleValidWarning('criterion-fits-band-selected', criterion);
    }
    if (this.rgb_types_stiff || this.rgb_types_lupton) {
      var criterion = this._bandsSelected(this.rgb_bands) === 3
      validForm = criterion && validForm;
      this._toggleValidWarning('criterion-three-bands', criterion);
    }
    if (this.tabIdx === 0) {
      var textareaID = 'coadd-id-textarea';
    } else {
      var textareaID = 'coords-textarea';
    }
    var currentText = this.shadowRoot.getElementById(textareaID).value;
    if (this.positions !== currentText) {
      this._validateCsvFile(currentText);
    }
    var criterion = this.positions === currentText
    validForm = criterion && validForm;

    var criterion = this._validateEmail();
    validForm = criterion && validForm;
    if (this.validEmail) {
      this.shadowRoot.getElementById('email-options').classList.remove('invalid-form-element');
    } else {
      var that = this;
      this._toast(false, 'Please enter a valid email address.', () => {
        that.shadowRoot.getElementById('email-options').classList.add('invalid-form-element');
      });
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
      this.shadowRoot.getElementById('rgb_bands_selector').style.display = 'none';
    } else {
      this.shadowRoot.getElementById('rgb_bands_selector').style.display = 'block';
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
      this._ensureThreeRgbBands();
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
    if (this.fits_bands.checked[band] === false) {
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

  }

  _ensureThreeRgbBands() {
    var numChecked = 0;
    for (var b in this.rgb_bands.checked) {
      if (this.rgb_bands.checked[b]) {
        numChecked += 1;
      }
    }
    if (numChecked > 2) {
      for (var b in this.rgb_bands.disabled) {
        if (!this.rgb_bands.checked[b]) {
          this.rgb_bands.disabled[b] = true;
        }
      }
    } else {
      for (var b in this.rgb_bands.disabled) {
        this.rgb_bands.disabled[b] = false;
      }
    }
  }
  _updateRgbSelection(event, band) {
    this.rgb_bands.checked[band] = event.target.checked;
    this._ensureThreeRgbBands();
    // This hack seems necessary to trigger the hasChanged() function for the property
    var temp = this.rgb_bands;
    this.rgb_bands =  {};
    this.rgb_bands =  temp;
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
        that.positions = data.csv;
        that.shadowRoot.getElementById(textareaID).value = data.csv;
        that.shadowRoot.getElementById('csv-file-msg').innerHTML = 'Positions validated and processed.';
        that.shadowRoot.getElementById('csv-file-msg').style.color = 'green';
        that.shadowRoot.getElementById(textareaID).style['border-color'] = 'green';
      } else {
        that.positions = 'INVALID';
        that.shadowRoot.getElementById('csv-file-msg').innerHTML = 'Please use valid CSV syntax and column headers.';
        that.shadowRoot.getElementById('csv-file-msg').style.color = 'red';
        that.shadowRoot.getElementById('coadd-id-textarea').style['border-color'] = 'red';
        that.shadowRoot.getElementById('coords-textarea').style['border-color'] = 'red';
      }
    })
  }

  _updateTabbedContent(event) {
    this.tabIdx = this.shadowRoot.getElementById('tab-selector').selected;
  }

  _toast(status, msg, callback) {
    if (status) {
      var elId = 'toast-job-success';
    } else {
      var elId = 'toast-job-failure';
    }
    this.shadowRoot.getElementById(elId).text = msg;
    this.shadowRoot.getElementById(elId).show();
    callback();
  }

  _validateEmail(){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.shadowRoot.getElementById('send-email').checked) {
      this.validEmail = re.test(String(this.email).toLowerCase());
    } else {
      this.validEmail = true;
    }
    return this.validEmail;
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = state.app.email;
  }

  firstUpdated() {
    var that = this;
    this.shadowRoot.getElementById('coadd-id-textarea').addEventListener('blur', function (event) {
      that._validateForm();
    });
    this.shadowRoot.getElementById('coords-textarea').addEventListener('blur', function (event) {
      that._validateForm();
    });
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'submit_disabled':
          this.shadowRoot.getElementById('bc_submitJobButton').disabled = this.submit_disabled;
          break;
        case 'fits':
          if (this.fits) {
            this.shadowRoot.getElementById('fits_bands_selector').style.display = 'block';
          } else {
            this.shadowRoot.getElementById('fits_bands_selector').style.display = 'none';
          }
        case 'customJobName':
          var originalName = this.customJobName;
          var validJobName = this.customJobName.replace(/[^a-z0-9_\-]/gi,'_').substring(0,128);
          this.customJobName = validJobName;
          if (originalName !== validJobName) {
            this._toast(false, 'Please use only valid characters (a-z, _, -, 0-9) in custom job names. Maximum length is 128 characters.', () => {});
          }
        case 'email':
          this._validateEmail();
        default:
          // Assume that we want to revalidate the form when a property changes
          this._validateForm();
      }
    });
  }
}

window.customElements.define('des-cutout', DESCutout);
