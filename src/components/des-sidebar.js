import { LitElement, html, css } from 'lit-element';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';

class DESSideBar extends LitElement {
    static get properties() {
      return {
        value: { type: Number }
      }
    }
  
    static get styles() {
      return [
        css`
            .test { color: red;}
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
  
  window.customElements.define('des-sidebar', DESSideBar);