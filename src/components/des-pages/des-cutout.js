import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-card/paper-card.js';
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
  }

  render() {
    return html`

    <section>
        <des-card heading = "Bulk Cutouts Form" >
            <div class="card-content">
                <!--<div class="top">
                    Upload a file with CoaddIDs or RA/DEC positions, or enter them manually and run the cutout generator
                </div>-->

                <table id="coadd-table" style="width:100%">

                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="backup" slot="item-icon"></iron-icon>
                                <iron-icon icon="hardware:keyboard" slot="item-icon"></iron-icon>
                                <span style="overflow-x:auto; overflow-wrap:break-word;">Upload csv file (with header). <br />Or enter values manually (with header).</span>
                            </paper-icon-item>
                        </td>
                        <td class="btcell">
                            <div class="around-cell">
                                <paper-button raised class="indigo" id="bc_uploadFile">
                                    <div id="bc_uploadicon" style="display: inline-block;">
                                        <i class="fa fa-cloud-upload"></i>
                                        &nbsp;  &nbsp;
                                    </div>
                                    <span style="overflow-x: auto; overflow-wrap: break-word;">
                                        [[file_name]]
                                    </span>
                                    <input type="file" class="upload" id="filesAB" on-change="_fileChange" />
                                </paper-button>
                                <paper-button raised class="indigo" id="bc_enterManually" on-tap="_bc_openManualEntry">
                                    <div id ="bc_keyboardicon" style="display: inline-block;">
                                        <i class="fa fa-keyboard-o"></i>
                                        &nbsp;  &nbsp;
                                    </div>
                                    <span>[[enter_values]]</span>
                                </paper-button>
                            </div>
                        </td>
                    </tr>

                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="check" slot="item-icon"></iron-icon>
                                Generate color png or  just FITS cutouts &nbsp; <span style="color:red"> required</span>
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <div class="around-cell">
                                <div class="left">
                                    <paper-checkbox style="font-size:16px; padding-top:15px;" id="bc_tiffs">Stiff_RGB</paper-checkbox>
                        <iron-icon icon="icons:create" style="height: 15px; width: 15px; color: #666666;" on-click="rgboptions"></iron-icon>
                                </div>
                                <div class="left">
                                    <paper-checkbox style="font-size:16px; padding-top:15px;" id="bc_pngs">Lupton_RGB</paper-checkbox>
                        <iron-icon icon="icons:create" style="height: 15px; width: 15px; color: #666666;" on-click="rgboptions"></iron-icon>
                                </div>
                                <div class="left">
                                    <paper-checkbox style="font-size:16px; padding-top:15px;" id="bc_fits" on-change="fitsoptions"> Just FITS</paper-checkbox>
                        <iron-icon icon="icons:create" style="height: 15px; width: 15px; color: #666666;" on-click="fitsoptions"></iron-icon>
                                </div>
                            </div>
                        </td>
                    </tr>



                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="image:tune" slot="item-icon"></iron-icon>
                                <div>Xsize (in arcminutes):
                                    <span id="bc_xsizeLabel" class="caption">1.0</span></div>
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <paper-slider id="bc_xsizeSlider" pin max="12" max-markers="10" step="0.1" value="1.0" expand editable></paper-slider>
                        </td>
                    </tr>
                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="image:tune" slot="item-icon"></iron-icon>
                                <div>Ysize (in arcminutes):
                                    <span id="bc_ysizeLabel" class="caption">1.0</span></div>
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <paper-slider id="bc_ysizeSlider" pin  max="12" max-markers="10" step="0.1" value="1.0" expand editable></paper-slider>
                        </td>
                    </tr>
                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="image:tune" slot="item-icon"></iron-icon>
                                <div>Release Tag:
                                    <span id="bc_releaseLabel" class="caption">Y6A1</span></div>
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <paper-dropdown-menu id="bc_releaseSelector" >
                              <paper-listbox id="bc_releaseItem" slot="dropdown-content" class="dropdown-content" selected="0">
                              <paper-item>Y6A1</paper-item>
                              <paper-item>Y3A2</paper-item>
                              <paper-item>Y1A1</paper-item>
                              <paper-item>SVA1</paper-item>
                            </paper-listbox>

                            </paper-dropdown-menu>
                        </td>
                    </tr>

                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="create" slot="item-icon"></iron-icon>
                                Job Name
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <paper-input always-float-label id="bc_validname" name="name" label="Job Name" value="" style = "max-width: 500px;"></paper-input>
                        </td>
                    </tr>

                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="mail" slot="item-icon"></iron-icon>
                                Email Options
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <div class="around-cell">
                                <div class="left">
                                    <paper-checkbox style="font-size:16px; padding-top:25px;" id="bc_sendemail" on-change="emailcheck">Send email on completion</paper-checkbox>
                                </div>
                                <div class="right">
                                    <paper-input always-float-label id="bc_validemail" name="email" label="Email" value="" ></paper-input>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr class="coadd-tr">
                        <td class="coadd-td">
                            <paper-icon-item>
                                <iron-icon icon="save" slot="item-icon"></iron-icon>
                                Return Options
                            </paper-icon-item>
                        </td>
                        <td class="coadd-td">
                            <paper-checkbox style="font-size:16px;" id="bc_returnList">Include CSV of tiles matched to objects</paper-checkbox>
                        </td>
                    </tr>
                </table>
                <div class="coadd-container">
                    <div class="left">
                        <paper-button raised class="indigo"  id="clearFormButton" on-tap="_clearForm">
                        <i class="fa fa-cogs"></i> &nbsp;  &nbsp;Clear Form
                        </paper-button>
                        </div>
                    <div class="right">
                        <paper-button raised  class="indigo"  id="bc_submitJobButton" disabled on-tap="_submitJob">
                        <i class="fa fa-cogs"></i> &nbsp;  &nbsp;Submit Job
                        </paper-button>
                    </div>
                </div>
            </div>
        </des-card>

        <des-positions-bc id="desPositionsBC"></des-positions-bc>
        <!--
        <des-positions-coadds-bc id="desPositionsCoaddsBC"></des-positions-coadds-bc>
        <des-positions-coords-bc id="desPositionsCoordsBC"></des-positions-coords-bc>
        -->

        <paper-toast class="toast-position toast-success" id="bc_toast1coadd" text="Job has been submitted!" duration="6000"> </paper-toast>
        <paper-toast class="toast-position toast-error" id="bc_toast2coadd" text="ERROR!. There was an error. Please try again" duration="6000"> </paper-toast>
        <paper-toast class="toast-position toast-error" id="bc_toast3coadd" text="Form is incomplete for selected options!" duration="6000"> </paper-toast>

        <paper-dialog class="size-position2" id="bc_emaildialog" with-backdrop on-iron-overlay-opened="patchOverlay">
            <paper-card elevation="0">
                <div class="card-content">
                    Please verify email address
                </div>
            </paper-card>
        </paper-dialog>
        <paper-dialog id="bc_rgbbandsDialog" with-backdrop on-iron-overlay-opened="patchOverlay">
            <paper-card elevation="0">
                <div class="card-content">
                    Please enter RGB Bands to create color cutouts, e.g.: i,r,g
                      <div class="right">
                          <paper-input always-float-label id="bc_rgb_values" name="rgbbands" label="RGB Bands" value="i,r,g"></paper-input>
                      </div>
                  <div class="card-actions">
                    <paper-button dialog-dismiss autofocus raised class="indigo">Close</paper-button>
                </div>
                </div>
            </paper-card>
        </paper-dialog>
        <paper-dialog style="width: 40%;" id="bc_fitsOptionsDialog" with-backdrop on-iron-overlay-opened="patchOverlay" >
            <paper-card heading= "Select bands" elevation="0" >
                <div class="card-content">
                            <div class="around-cell">
                                <paper-checkbox class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_gband">g</paper-checkbox>
                                &nbsp;
                                &nbsp;
                                <paper-checkbox class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_rband">r</paper-checkbox>
                                &nbsp;
                                &nbsp;
                                <paper-checkbox class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_iband">i</paper-checkbox>
                                &nbsp;
                                &nbsp;
                                <paper-checkbox class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_zband">z</paper-checkbox>
                                &nbsp;
                                &nbsp;
                                <paper-checkbox class="bandbox" style="font-size:16px; padding-top:15px;" id="bc_Yband">Y</paper-checkbox>
                                &nbsp;
                                &nbsp;
                                <paper-toggle-button style="font-size:16px; padding-top:15px;" id="bc_all_toggle" on-change="toggle_all_bands">Select All</paper-toggle-button>
                                &nbsp;
                                <br />
                </div>
                                <br />
                <div class="card-actions">
                    <paper-button dialog-dismiss autofocus raised class="indigo">Close</paper-button>
                </div>
            </paper-card>
        </paper-dialog>
    </section>
    `;
  }

  stateChanged(state) {
    this.username = state.app.username;
  }

}

window.customElements.define('des-cutout', DESCutout);
