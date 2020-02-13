import { LitElement, html, css } from 'lit-element';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './des-icons.js';

class DESToolBar extends LitElement {
    static get properties() {
      return {
        value: { type: Number }
      }
    }
  
    static get styles() {
      return [
        css`
        .toolbar-top {
          background-color: black;
          font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: normal;
          font-style: normal;
          color: white;
        }

        [main-wide-title] {
          display: none;
          margin-left: 256px;
        }
        

        .menu-btn {
          background: none;
          border: none;
          fill: white;
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        @media (min-width: 460px) {

          .menu-btn {
            display: none;
          }
        
          [main-wide-title] {
            padding-right: 0px;
            display: block;
          }
          [main-narrow-title] {
            display: none;
          }
        }


        `
      ];
    }
  
    _ClickHandler(e) {
      this.dispatchEvent(new CustomEvent('clickMenu'));
    }

    render() {
      return html`
        <app-toolbar class="toolbar-top" sticky>
          <button class="menu-btn" title="Menu" @click="${this._ClickHandler}">${menuIcon}</button>
          <div main-wide-title>DARK ENERGY SURVEY desaccess</div>
          <div main-narrow-title>DES desaccess</div>
    </app-toolbar>
      `;
    }
  
    constructor() {
      super();
      this.value = 0;
    }
  
    
  }
  
  window.customElements.define('des-toolbar', DESToolBar);