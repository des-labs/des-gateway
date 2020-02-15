import {
  LitElement,
  html,
  css
} from 'lit-element';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

class DESSideBar extends LitElement {
  static get properties() {
    return {
      name: {
        type: String
      },
      email: {
        type: String
      }
    }
  }
  static get styles() {
    return [
      css `
        .info-container {
          position: relative;
          border: 2px solid #ccc;
          border-radius: 50%;
          height: 90px;
          padding: 2px;
          width: 90px;
          margin: 20px auto;
      }
      .info-container .image {
          background-image: url('images/user.png');
          background-size: contain;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          background-repeat: no-repeat;
          background-position: center;
      }
      .self-info {
          margin: 0 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #CCC;
          text-align: center;
      }
      .self-info .name {
          font-weight: bold;
      }
      .self-info .email {
          color: #999;
      }
        `
    ];
  }


  render() {
    return html `

      <app-toolbar style="background-color: black;">
        <iron-image
        style="width:60px; height:60px;"
        sizing="cover"
        src="images/DESDM_logo.png"></iron-image>
        </app-toolbar>

        <div class="info-container">
          <div class="image"></div>
        </div>
        <div class="self-info">
          <div class="name">${this.name}</div>
          <div class="email">${this.email}</div>
        </div>
    </app-toolbar>
      `;
  }

  constructor() {
    super();
  }


}

window.customElements.define('des-sidebar', DESSideBar);