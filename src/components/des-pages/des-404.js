import { html } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import {config} from '../des-config.js';
import { SharedStyles } from '../styles/shared-styles.js';

class DES404 extends PageViewElement {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="${config.rootPath}">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('des-404', DES404);
