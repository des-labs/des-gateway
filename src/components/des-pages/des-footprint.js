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
//import '@vaadin/vaadin-dialog/vaadin-dialog.js'
//import '@vaadin/vaadin-grid';
//import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
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
            <div class="flex" style="display: inline-block;">
              <p style="margin-top: 0;">Search a tile by position or name. </p>
              <paper-input 
                style=" margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Position (ra,dec)"
                @change="${(e) => {this.customCoords = e.target.value}}"
                id="custom-coords" name="custom-coords" class="custom-coords">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit(e)}"></paper-icon-button>
                <paper-spinner id="submit-spinner" class="big"></paper-spinner>

              </paper-input>
              <paper-input
                style="margin-top: -30px; float: left; max-width: 50%; padding-left:2rem;"
                placeholder="Tilename"
                @change="${(e) => {this.tileName = e.target.value}}"
                id="custom-tile" name="custom-tile" class="custom-tile">
                <paper-icon-button slot="suffix" icon="search" @click="${(e) => this._submit(e)}"></paper-icon-button>
                <paper-spinner id="submit-spinner" class="big"></paper-spinner>

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
        Click <a href="https://desar2.cosmology.illinois.edu/DESFiles/desarchive/OPS/multiepoch/"> here</a> to get access to all campaign tiles<a href></a>
      </section>
      <div>
        <paper-toast class="toast-position toast-success" id="toast-job-success" text="Job has been submitted!" duration="7000"> </paper-toast>
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
    
    let columnElements = [];
    for (var key in this.data) {
      columnElements.push(html`
        <paper-button class="download" raised >
        <a style="color:black; display: inline-block; width: 100%; height: 10%; text-align:center; text-decoration:none" href="${this.data[key]}" target="_blank">${key}</a>  
        </paper-button>
      `);
    }
    this.columnElements = columnElements;
    
  } 

  stateChanged(state) {
    this.username = state.app.username;
    this.db = state.app.db;
    this.email = this.email === '' ? state.app.email : this.email;

  }
  _constructJobSubmitBody(query) {
    let body = {
      job: 'query',
      username: this.username,
      query: query,
      filename: "quick.csv",
      quick: "true"

    };
    return body;
  }

  _toggleSpinner(active, callback) {
    this.shadowRoot.getElementById('submit-spinner').active = active;
    callback();
  }

  _submit(event) {
        this._submitJob(() => {
          this._toggleSpinner(true, () => {});
        });

  }

  _submitJob(callback) {
    const Url=config.backEndUrl + "job/submit";
    var coords_split = this.customCoords.split(",");
    this.ra = coords_split[0];
    this.dec = coords_split[1];
    if (this.ra > 180){
      this.raAdjusted = 360-this.ra;
    }
    else{
      this.raAdjusted = this.ra;
    }
  
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

    var query_with_tilename = `select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'sva1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y, count(o.tilename) as nobjects from sva1_coadd_objects o,mcarras2.sva1_tile_info m,y3a2_coaddtile_geom g where m.tilename=o.tilename and g.tilename=o.tilename and m.tilename='${this.tileName}' and m.tilename=g.tilename group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'sva1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y1a1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from y1a1_coadd_objects o, mcarras2.y1a1_tile_info m,y3a2_coaddtile_geom g where m.tilename=o.tilename and g.tilename=o.tilename and m.tilename='${this.tileName}' and m.tilename=g.tilename group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y1a1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y3a2' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from y3a2_coadd_object_summary o,mcarras2.y3a2_tile_info m,y3a2_coaddtile_geom g where m.tilename=o.tilename and g.tilename=o.tilename and m.tilename='${this.tileName}' and m.tilename=g.tilename group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y3a2',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y6a1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from y6a1_coadd_object_summary o,mcarras2.y6a1_tile_info m,y3a2_coaddtile_geom g where m.tilename=o.tilename and g.tilename=o.tilename and m.tilename='${this.tileName}' and m.tilename=g.tilename group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y6a1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y`;

    var query_with_coords = `select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'sva1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from sva1_coadd_objects o, mcarras2.sva1_tile_info m,y3a2_coaddtile_geom g where m.tilename=g.tilename and o.tilename=g.tilename and o.tilename=m.tilename and (${this.dec} between g.UDECMIN and g.UDECMAX) and ((g.CROSSRA0='N' and (${this.ra} between g.URAMIN and g.URAMAX)) or (g.CROSSRA0='Y' and (${this.raAdjusted} between g.URAMIN-360 and g.URAMAX))) group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'sva1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y1a1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y, count(o.tilename) as nobjects from y1a1_coadd_objects o, mcarras2.y1a1_tile_info m,y3a2_coaddtile_geom g where m.tilename=g.tilename and o.tilename=g.tilename and o.tilename=m.tilename and (${this.dec} between g.UDECMIN and g.UDECMAX) and ((g.CROSSRA0='N' and (${this.ra} between g.URAMIN and g.URAMAX)) or (g.CROSSRA0='Y' and (${this.raAdjusted} between g.URAMIN-360 and g.URAMAX))) group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y1a1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y3a2' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from y3a2_coadd_object_summary o,mcarras2.y3a2_tile_info m,y3a2_coaddtile_geom g where  m.tilename=g.tilename and o.tilename=g.tilename and o.tilename=m.tilename and (${this.dec} between g.UDECMIN and g.UDECMAX) and ((g.CROSSRA0='N' and (${this.ra} between g.URAMIN and g.URAMAX)) or (g.CROSSRA0='Y' and (${this.raAdjusted} between g.URAMIN-360 and g.URAMAX))) group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y3a2',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y UNION ALL select o.tilename,RACMIN,RACMAX,DECCMIN,DECCMAX,RA_CENT,DEC_CENT,'y6a1' as release,fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y,count(o.tilename) as nobjects from y6a1_coadd_object_summary o,mcarras2.y6a1_tile_info m,y3a2_coaddtile_geom g where m.tilename=g.tilename and o.tilename=g.tilename and o.tilename=m.tilename and (${this.dec} between g.UDECMIN and g.UDECMAX) and ((g.CROSSRA0='N' and (${this.ra} between g.URAMIN and g.URAMAX)) or (g.CROSSRA0='Y' and (${this.raAdjusted} between g.URAMIN-360 and g.URAMAX))) group by o.tilename,racmin,racmax,deccmin,deccmax,ra_cent,dec_cent,'y6a1',fits_image_g,fits_catalog_g,fits_image_r,fits_catalog_r,fits_image_i,fits_catalog_i,fits_image_z,fits_catalog_z,fits_image_y,fits_catalog_y`;

    if (this.customCoords){
      var query = query_with_coords;
    }
    else {
      var query = query_with_tilename;
    }
    let body = this._constructJobSubmitBody(query);
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
        this.shadowRoot.getElementById('toast-job-success').text = 'Searching for files...';
        this.shadowRoot.getElementById('toast-job-success').show();
        this._pollQuickQueryResult(data.jobid);
      } else {
        console.log("data status no okay")
        this.shadowRoot.getElementById('toast-job-failure').text = 'Error searching for files: ' + data.message;
        this.shadowRoot.getElementById('toast-job-failure').show();
        console.log(JSON.stringify(data));
      }
      callback();
    });

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
            this._setValuesFromQuickQueryResults(results);
          } else {
            this.results = '';
            this.shadowRoot.getElementById('toast-job-failure').text = 'Quick query failed: ' + data.jobs[0].job_status_message;
            this.shadowRoot.getElementById('toast-job-failure').show();
          }
        }
      } else {
        console.log(JSON.stringify(data));
      }
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

  _setValuesFromQuickQueryResults(results){

    // clearing out file data 
    this.Y1A1Files = {}
    this.SVA1Files = {}
    this.Y3A2Files = {}
    this.Y6A1Files = {}

    if (results.length == 0){
      this.shadowRoot.getElementById('toast-job-failure').text = 'No files found!';
      this.shadowRoot.getElementById('toast-job-failure').show();
    }
    else{
      this.tileName = results[0]["TILENAME"];
      this.displayTile = this.tileName;

      this.tileCenter = results[0]["RA_CENT"] + ", " + results[0]["DEC_CENT"];
      this.raCorners = results[0]["RACMIN"] + ", " + results[0]["RACMAX"];
      this.decCorners = results[0]["DECCMIN"] + ", " + results[0]["DECCMAX"];

      var i;
      for (i = 0; i < results.length; i++){
        if (results[i]["RELEASE"] == 'y6a1'){
          this.nObjects = results[i]["NOBJECTS"]
        }
        var bands = ["G","R","I","Z","Y"];
        for (var k=0; k < bands.length ; k++){
          var imName = "FITS_IMAGE_" + bands[k];
          var caName = "FITS_CATALOG_" + bands[k];
          if (results[i]=='sva1' || results[i]['RELEASE']=='y1a1'){
            var imPath = "/alpha-desaccess/api/data/" + results[i][imName].split("OPS/")[1]+ "?token=" + localStorage.getItem("token");
            var caPath = "/alpha-desaccess/api/data/" + results[i][caName].split("OPS/")[1]+ "?token=" + localStorage.getItem("token");
          }
          else{
            var imPath = "/alpha-desaccess/api/data/desarchive/" + results[i][imName].split("OPS/")[1]+ "?token=" + localStorage.getItem("token");
            var caPath = "/alpha-desaccess/api/data/desarchive/" + results[i][caName].split("OPS/")[1]+ "?token=" + localStorage.getItem("token");
          }
        
          if (results[i]['RELEASE'] == 'sva1'){
            this.shadowRoot.querySelectorAll("paper-button.sva1")[0].disabled = false;
            this.SVA1Files[imName] = imPath;
            this.SVA1Files[caName] = caPath;
          }
      
          if (results[i]['RELEASE'] =='y1a1'){
            this.shadowRoot.querySelectorAll("paper-button.y1a1")[0].disabled = false;
            this.Y1A1Files[imName] = imPath;
            this.Y1A1Files[caName] = caPath;
          }
    
          if (results[i]['RELEASE'] == 'y3a2'){
            this.shadowRoot.querySelectorAll("paper-button.y3a2")[0].disabled = false;
            this.Y3A2Files[imName] = imPath;
            this.Y3A2Files[caName] = caPath;
        }
    
          if (results[i]['RELEASE'] == 'y6a1'){
            this.shadowRoot.querySelectorAll("paper-button.y6a1")[0].disabled = false;
            this.Y6A1Files[imName] = imPath;
            this.Y6A1Files[caName] = caPath;
          }
        }
      }
    }

  }
  
}

window.customElements.define('des-footprint', DESFootprint);