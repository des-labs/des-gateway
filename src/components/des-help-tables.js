import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';

class DESHelpTables extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <h3>DB Tables Help</h3>
      <p>The DES Tables browser shows you all the DES database tables you have permission to view. For each table in the list, you can view a description of the table's schema by toggling the checkbox on that table's row.</p>
      <p>
        All of your personal tables are displayed in the My Tables viewer.
      </p>
    `;
  }
}

window.customElements.define('des-help-tables', DESHelpTables);
