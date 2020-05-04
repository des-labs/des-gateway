import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vanillawc/wc-codemirror/index.js';
import '@vanillawc/wc-codemirror/mode/sql/sql.js';


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

      <div class="content">
          Specify your cutout request below.
      </div>
    `;
  }

  stateChanged(state) {
    this.username = state.app.username;
  }

}

window.customElements.define('des-cutout', DESCutout);
