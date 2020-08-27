import { html,css } from 'lit-element';
import { render } from 'lit-html';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';

class DESTables extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        .schema-header-row {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .schema-field-row {
          font-family: monospace;
        }
      `
    ];
  }

  static get properties() {
    return {
      description: {type: Object}
    };
  }

  constructor(){
    super();
    this.description = {};
    this.detailRenderIntervalId = {};
    this.schema = null;
  }

  render() {
    return html`
    <section>
      <div style="font-size: 2rem; font-weight: bold;">
        DES Database Tables
        <paper-spinner class="big"></paper-spinner>
      </div>
      <div>
        <p>Explore the tables available in the DES database.</p>
      </div>
      <vaadin-grid .multiSort="${true}" style="height: 70vh; max-width: 85vw;">
        <vaadin-grid-filter-column path="table.name" header="Table Name"></vaadin-grid-filter-column>
        <vaadin-grid-sort-column   path="table.rows" header="Number of Rows"></vaadin-grid-sort-column>
        <vaadin-grid-column id="details"></vaadin-grid-column>
      </vaadin-grid>
    </section>
    <dom-module id="my-grid-styles" theme-for="vaadin-grid">
      <template>
        <style>
          .monospace-column {
            font-family: monospace;
            font-size: 0.8rem;
          }
        </style>
      </template>
    </dom-module>
    `;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    
    // Apply class names for styling
    this.grid.cellClassNameGenerator = function(column, rowData) {
      let classes = '';
      classes += ' monospace-column';
      return classes;
    };

    this.grid.rowDetailsRenderer = (root, grid, rowData) => {
      if (!root.firstElementChild) {
        console.log(`rowDetailsRenderer - data.schema: \n${JSON.stringify(this.schema, null, 2)}`);
        if (this.schema !== null) {
          render(
            html`
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; border-top: darkgray solid thin; margin: 1rem;">
              <div class="schema-header-row">Column Name</div>
              <div class="schema-header-row">Data Type</div>
              <div class="schema-header-row">Data Format</div>
              <div class="schema-header-row">Comments</div>
              ${this.schema.map(field => html`
                <div class="schema-field-row">${field['COLUMN_NAME']}</div>
                <div class="schema-field-row">${field['DATA_TYPE']}</div>
                <div class="schema-field-row">${field['DATA_FORMAT']}</div>
                <div class="schema-field-row">${field['COMMENTS']}</div>
              `)}
              </div>
            `, root);
        }
      }

    };
    this.grid.rowDetailsRenderer = this.grid.rowDetailsRenderer.bind(this);

    this.detailsToggleColumn = this.shadowRoot.querySelector('#details');
    this.detailsToggleColumn.renderer = (root, column, rowData) => {
      if (!root.firstElementChild) {
        root.innerHTML = '<vaadin-checkbox>Show schema...</vaadin-checkbox>';
        root.firstElementChild.addEventListener('checked-changed', (e) => {
          if (e.detail.value) {
            this._fetchTableDescription(rowData.item.table.name, root.item);
          } else {
            this.grid.closeItemDetails(root.item);
          }
        });
      }
      root.item = rowData.item;
      root.firstElementChild.checked = this.grid.detailsOpenedItems.indexOf(root.item) > -1;
    };
    this.detailsToggleColumn.renderer = this.detailsToggleColumn.renderer.bind(this);

    this._fetchAllTables();
  }

  _fetchTableDescription(tableName, gridItem) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "tables/describe"
    let body = {
      'table': tableName,
      'owner': "nobody"
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
      this.shadowRoot.querySelector('paper-spinner').active = false;
      if (data.status === "ok") {
        this.schema = data.schema;
        console.log(`data.schema: \n${JSON.stringify(this.schema, null, 2)}`);
        this.grid.openItemDetails(gridItem);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _fetchAllTables() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "tables/list/all"
    let body = {};
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
        // console.log(JSON.stringify(data.users, null, 2));
        this.tables = data.tables;
        this._updateTableList(this.tables)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
  _updateTableList() {
    let grid = this.grid;
    let gridItems = [];
    // Allow an empty table
    if (this.tables.length === 0) {
      grid.items = gridItems;
      return;
    }
    let ctr = 0;
    this.tables.forEach((item, index, array) => {
      let table = {};
      table.name = item['TABLE_NAME'];
      table.rows = item['NROWS'];
      gridItems.push({table: table});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.table.name}).indexOf(grid.selectedItems[i].table.name) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.table.name}).indexOf(grid.items[i].table.name) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    })
  }

}

window.customElements.define('des-tables', DESTables);
