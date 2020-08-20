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

class DESFootprint extends connect(store)(PageViewElement) {

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

          .download {
            display: flex;
            width: 100%;
            height: 10%;
          }

          .around-cell {
              @apply(--layout-horizontal);
              @apply(--layout-around-justified);
          }

          .around-cell2 {
              @apply(--layout-horizontal);
              @apply(--layout-center-justified);
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
          /* .invalid-form-element {
            color: red;
            border-color: red;
            border-width: 1px;
            border-style: dashed;
          } */

          .grid-system {
              display: grid;
              grid-gap: 1rem;
              padding: 1rem;
          }
          .position-section {
            grid-template-columns: 70% 30%;
          }
          section {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          h2 {
            padding-top: 0;
            padding-bottom: 0;
          }

          @media (min-width: 1001px) {
            #submit-container {
              left: 250px;
            }

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

          paper-button.y6a1 {
            background-color: var(--paper-purple-500);
            color: white;
          }
          paper-button.y3a2 {
            background-color: var(--paper-blue-500);
            color: white;
          }
          paper-button.y5a1 {
              background-color: var(--paper-yellow-900);
              color: white;
          }
          paper-button.y1a1 {
              background-color: var(--paper-green-500);
              color: white;

          }
          paper-button.sva1 {
              background-color: var(--paper-red-500);
              color: white;
          }

          paper-button[disabled] {
            background: #eaeaea;
            color: #a8a8a8;
            cursor: auto;
            pointer-events: none;
        }

        }
          
        `,

    ];
  }

  static get properties() {
    return {
      _value: { type: Number },
      msg: {type: String},
      username: {type: String},
      results: {type: String},
      customJobName: {type: String},
      tileName: {type: String},
      tileCenter: {type: String},
      nObjects: {type: String},
      raCorners: {type: String},
      decCorners: {type: String},
      customCoords: {type: String},
      ra: {type: String},
      raAdjusted: {type: String},
      dec: {type: String},
      Y1A1Files: {type: Object},
      SVA1Files: {type: Object},
      Y3A2Files: {type: Object},
      Y6A1Files: {type: Object},
      refreshStatusIntervalId: {type: Number},
      release: {type: String},
      data: {type: Object},
      columnElements: {type: Object},
    };
  }

  constructor(){
    super();
    this.username = '';
    this.msg = '';
    this.results = '';
    this.tileName = '';
    this.tileCenter = '';
    this.nObjects = '';
    this.raCorners = '';
    this.decCorners = '';
    this.customCoords = '';
    this.refreshStatusIntervalId = 0;
    this.ra = '';
    this.raAdjusted = '';
    this.dec = '';
    this.SVA1Files = {};
    this.Y1A1Files = {};
    this.Y3A2Files = {};
    this.Y6A1Files = {};
    this.release = '';
    this.data = null;
    this.columnElements = null;
  }

  render() {
    return html`
    <div>
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DES Footprint
          <paper-spinner class="big"></paper-spinner>
        </div>
            <div class="flex" style="display: inline-block;">
              <p style="margin-top: 0;">Search a tile by position or name. </p>
              <paper-input 
                style=" margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Position (ra,dec)"
                @change="${(e) => {this.customCoords = e.target.value}}"
                id="custom-coords" name="custom-coords" class="custom-coords">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit('coords')}"></paper-icon-button>
                
                </paper-input>
                <paper-input
                style="margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Tilename"
                @change="${(e) => {this.tileName = e.target.value}}"
                id="custom-tile" name="custom-tile" class="custom-tile">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit('name')}"></paper-icon-button>
                
              </paper-input>
            </div>
      </section>
      <section>
        <h2>Tile Properties</h2>
        <div>
        Name: ${this.displayTile}<br>
        Tile Center: ${this.tileCenter}<br>
        No. Objects (Y6): ${this.nObjects}<br>
        RA Corners: ${this.raCorners}<br>
        DEC Corners: ${this.decCorners}<br><br>
        </div>

        Download Files for this tile:<br>
        <paper-button disabled raised class="y6a1" @click="${(e) => this._getFiles(e,'Y6A1')}">Y6A1</paper-button>
        <paper-button disabled raised class="y3a2" @click="${(e) => this._getFiles(e,'Y3A2')}">Y3A2</paper-button>
        <paper-button disabled raised class="y1a1" @click="${(e) => this._getFiles(e,'Y1A1')}">Y1A1</paper-button>
        <paper-button disabled raised class="sva1" @click="${(e) => this._getFiles(e,'SVA1')}">SVA1</paper-button><br><br>
        <!-- Click <a href="https://desar2.cosmology.illinois.edu/DESFiles/desarchive/OPS/multiepoch/"> here</a> to get access to all campaign tiles<a href></a> -->
      </section>
      <div>
        <paper-toast class="toast-position toast-error" id="toast-job-failure" text="ERROR! There was an error. Please try again" duration="7000"> </paper-toast>
      </div>
    </div>
    <paper-dialog class="dialog-position" id="getTiles" with-backdrop on-iron-overlay-opened="patchOverlay">
      <h2>Files for ${this.tileName} in ${this.release}</h2>
      <div id="insideDialog">
        ${this.columnElements}
      </div>
  
      <div class="buttons">
        <paper-button class="indigo" raised dialog-confirm>Ok</paper-button><br />
      </div>
    </paper-dialog>
    `;
  }

  _getFiles(event,release){

    this.data = null;
    if (release == 'Y6A1'){
      this.data = this.Y6A1Files;
      this.release = release;
      this.shadowRoot.getElementById('getTiles').open();
    }
    if (release == 'Y3A2'){
      this.data = this.Y3A2Files;
      this.release = release;
      this.shadowRoot.getElementById('getTiles').open();
    }
    if (release == 'Y1A1'){
      this.data = this.Y1A1Files;
      this.release = release;
      this.shadowRoot.getElementById('getTiles').open();
    }
    if (release == 'SVA1'){
      this.data = this.SVA1Files;
      this.release = release;
      this.shadowRoot.getElementById('getTiles').open();
    }
    
    for (var key in this.data) {
      columnElements.push(html`
      
      <div>
        <paper-button class="download" raised
        @click="${(e) => {window.open(this.data[key],'_blank')}}"> 
        ${key}
        </paper-button>
        </div>
      `);
    }
    this.columnElements = columnElements;
    
  } 

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = this.email === '' ? state.app.email : this.email;

  }

  _submit(type) {
    this._getTileInfo(type);
  }
  _getTileInfo(type) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
  
    // unsetting display values
    this.raCorners = '';
    this.decCorners = '';
    this.tileCenter = '';
    this.nObjects = '';
    this.displayTile = '';
    this.shadowRoot.querySelectorAll("paper-button.sva1")[0].disabled = true;
    this.shadowRoot.querySelectorAll("paper-button.y1a1")[0].disabled = true;
    this.shadowRoot.querySelectorAll("paper-button.y3a2")[0].disabled = true;
    this.shadowRoot.querySelectorAll("paper-button.y6a1")[0].disabled = true;

    let body = {}
    let Url=config.backEndUrl + "tiles/info/";
    if (type === 'coords'){
      Url += 'coords';
      body = {
        'coords': this.customCoords
      }
    }
    else {
      Url += 'name';
      body = {
        'name': this.tileName
      }
    }
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
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        let results = data.results;
        this.results = results;
        this._setValuesFromQuickQueryResults(data);
        for (let i in data.links) {
          console.log(data.links[i]);
        }
      } else {
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error searching for files: ' + data.message;
        this.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
    });

  }

  _setValuesFromQuickQueryResults(response){

    // clearing out file data 
    this.Y1A1Files = {}
    this.SVA1Files = {}
    this.Y3A2Files = {}
    this.Y6A1Files = {}

    if (response.releases.length == 0){
      this.shadowRoot.getElementById('toast-job-failure').text = 'No files found!';
      this.shadowRoot.getElementById('toast-job-failure').show();
    }
    else{
      this.tileName = response.tilename;
      this.displayTile = this.tileName;

      this.tileCenter = response.ra_cent + ", " + response.dec_cent;
      this.raCorners = response.racmin + ", " + response.racmax;
      this.decCorners = response.deccmin + ", " + response.deccmax;

      for (let i = 0; i < response.releases.length; i++){
        if (response.releases[i]["release"] === 'y6a1'){
          this.nObjects = response.releases[i]["num_objects"];
        }
        for (let band in response.releases[i].bands) {

          let imName = "FITS_IMAGE_" + band;
          let caName = "FITS_CATALOG_" + band;
          if (response.releases[i]["release"] === 'sva1' || response.releases[i]["release"] === 'y1a1'){
            var imPath = config.backEndUrl + "data/" + response.releases[i].bands[band].image   + "?token=" + localStorage.getItem("token");
            var caPath = config.backEndUrl + "data/" + response.releases[i].bands[band].catalog + "?token=" + localStorage.getItem("token");
          }
          else{
            var imPath = config.backEndUrl + "data/desarchive/" + response.releases[i].bands[band].image    + "?token=" + localStorage.getItem("token");
            var caPath = config.backEndUrl + "data/desarchive/" + response.releases[i].bands[band].catalog  + "?token=" + localStorage.getItem("token");
          }
          switch (response.releases[i]["release"]) {
            case 'sva1':
              this.shadowRoot.querySelectorAll("paper-button.sva1")[0].disabled = false;
              this.SVA1Files[imName] = imPath;
              this.SVA1Files[caName] = caPath;
              break;
            case 'y1a1':
              this.shadowRoot.querySelectorAll("paper-button.y1a1")[0].disabled = false;
              this.Y1A1Files[imName] = imPath;
              this.Y1A1Files[caName] = caPath;
              break;
            case 'y3a2':
              this.shadowRoot.querySelectorAll("paper-button.y3a2")[0].disabled = false;
              this.Y3A2Files[imName] = imPath;
              this.Y3A2Files[caName] = caPath;
              break;
            case 'y6a1':
              this.shadowRoot.querySelectorAll("paper-button.y6a1")[0].disabled = false;
              this.Y6A1Files[imName] = imPath;
              this.Y6A1Files[caName] = caPath;
              break;
          
            default:
              break;
          }
        }

      }
    }

  }
  
}

window.customElements.define('des-footprint', DESFootprint);