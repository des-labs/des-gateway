import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vanillawc/wc-codemirror/index.js';
import '@vanillawc/wc-codemirror/mode/sql/sql.js';


class DESQueryTest extends connect(store)(PageViewElement) {
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
                            <paper-button id="subQuery" class="indigo medium" raised disabled on-tap="_submitQuery">Submit Job</paper-button>
                        </div>

                        <div class="btn-wrap">
                            <paper-button class="indigo medium" raised on-tap="clearQueryBox">Clear</paper-button>

                        </div>

                        <div class="btn-wrap">
                            <paper-button class="indigo medium" raised on-tap="_checkSyntax">Check</paper-button>
                        </div>

                        <div class="btn-wrap">
                            <paper-button id="QuickQuery" class="indigo medium" raised on-tap="_quickSubmit">Quick</paper-button>
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
                    <span>Output file (.csv, .fits or .h5). Enable in order to submit.</span>
                </td>
            </tr>
            <tr class="query-tr">
                <td class="query-td">
                    <paper-input style="margin-left:13px; margin-bottom: 14px; margin-top: -10px;" id="inputOutputFile" disabled required auto-validate label="Output file" ></paper-input>

                </td>
                <td class="query-td">
                    <paper-toggle-button class="queryButton" id="inputOutputCheck" noink on-tap="_enableOutputFile" style="margin-top: -10px">
                    </paper-toggle-button>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td">
                    <span style="color: red;">Options:</span>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-checkbox id="compress-box" style="margin-top: 18px; margin-left:10px;">Compressed files (csv and h5 files). Slightly longer jobs but smaller files</paper-checkbox>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-input  id="queryname" name="name" label="Job Name (optional)" value="" style="margin-top: -10px"></paper-input>
                </td>

            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-checkbox id="checkemail" style="margin-top: 18px; margin-left:10px;" on-change="_emailcheck">Send email after completion</paper-checkbox>
                </td>
            </tr>

            <tr class="query-tr">
                <td class="query-td" colspan="2">
                    <paper-input  id="queryemail" name="email" label="Email" value="" style="margin-top: -10px"></paper-input>
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

  stateChanged(state) {
    this.username = state.app.username;
  }

}

window.customElements.define('des-query-test', DESQueryTest);
