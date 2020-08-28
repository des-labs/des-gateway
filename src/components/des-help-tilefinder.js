import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';

class DESHelpTileFinder extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <h3>TileFinder Help</h3>
      <p>TileFinder allows you to search for DES data tiles based on sky coordinates or the name of the tile containing the data. Download links are generated for all available tile data across all relevant data releases.</p>
    `;
  }
}

window.customElements.define('des-help-tilefinder', DESHelpTileFinder);
