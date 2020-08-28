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
        vaadin-grid {
          height: 80vh; 
          max-width: 85vw;
        }
        ul {
          list-style-type: none; 
          margin: 0; 
          padding: 1rem; 
          line-height: 2rem;
        }
        a {
          font-weight: bold; 
          text-decoration: none; 
          color: inherit;
        }
        .table-heading {
          font-size: 1.5rem; 
          font-weight: bold; 
          margin-top: 2rem; 
          margin-bottom: 1rem;
        }
        iron-icon {
          color: darkgray;
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
        <ul>
          <li><a title="Scroll to table" href="#" onclick="return false;" @click="${(e) => {this._scrollToTable('all-tables')}}">
            All Tables
            <iron-icon icon="vaadin:angle-double-down"></iron-icon>
          </a></li>
          <li><a title="Scroll to table" href="#" onclick="return false;" @click="${(e) => {this._scrollToTable('my-tables')}}">
            My Tables
            <iron-icon icon="vaadin:angle-double-down"></iron-icon>
          </a></li>
        </ul>
      </div>
      <div>
        <a href="#" onclick="return false;" title="Back to top">
          <div class="table-heading"
            @click="${(e) => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });}}">
            All Tables
            <iron-icon icon="vaadin:angle-double-up"></iron-icon>
          </div>
        </a>
        <vaadin-grid id="all-tables" .multiSort="${true}">
          <vaadin-grid-filter-column path="table.name" header="Table Name"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column   path="table.rows" header="Number of Rows"></vaadin-grid-sort-column>
          <vaadin-grid-column class="details"></vaadin-grid-column>
        </vaadin-grid>
      </div>
      <div>
        <a href="#" onclick="return false;" title="Back to top">
          <div class="table-heading"
            @click="${(e) => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });}}">
            My Tables
            <iron-icon icon="vaadin:angle-double-up"></iron-icon>
          </div>
        </a>
        <vaadin-grid id="my-tables" .multiSort="${true}">
          <vaadin-grid-filter-column path="table.name" header="Table Name"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column   path="table.rows" header="Number of Rows"></vaadin-grid-sort-column>
          <vaadin-grid-column class="details"></vaadin-grid-column>
        </vaadin-grid>
      </div>
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

  _scrollToTable(tableId) {
    let el = this.shadowRoot.getElementById(tableId);
    window.scrollTo({
      top: el.getBoundingClientRect().top - 130,
      behavior: 'smooth'
    })
  }

  firstUpdated() {
    // this.gridAllTables = this.shadowRoot.querySelector('#all-tables');
    // this.gridMyTables = this.shadowRoot.querySelector('#my-tables');
    // this.bothGrids = [this.gridAllTables, this.gridMyTables];
    // this.bothGridsDetails = [
    //   this.shadowRoot.querySelector('#all-tables .details'),
    //   this.shadowRoot.querySelector('#my-tables .details')
    // ];
    this.grids = {
      'all': {
        'gridElement': this.shadowRoot.querySelector('#all-tables'),
        'detailsElement': this.shadowRoot.querySelector('#all-tables .details'),
        'apiEndpoint': 'tables/list/all'
      },
      'my': {
        'gridElement': this.shadowRoot.querySelector('#my-tables'),
        'detailsElement': this.shadowRoot.querySelector('#my-tables .details'),
        'apiEndpoint': 'tables/list/mine'
      }
    };
    
    // Apply class names for styling
    for (let grid in this.grids) {
      this.grids[grid].gridElement.cellClassNameGenerator = function(column, rowData) {
        let classes = '';
        classes += ' monospace-column';
        return classes;
      };
    }

    for (let grid in this.grids) {
      this.grids[grid].gridElement.rowDetailsRenderer = (root, grid, rowData) => {
        if (!root.firstElementChild) {
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
      this.grids[grid].gridElement.rowDetailsRenderer = this.grids[grid].gridElement.rowDetailsRenderer.bind(this);
    }

    for (let grid in this.grids) {
      this.grids[grid].detailsElement.renderer = (root, column, rowData) => {
        if (!root.firstElementChild) {
          root.innerHTML = '<vaadin-checkbox>Show schema...</vaadin-checkbox>';
          root.firstElementChild.addEventListener('checked-changed', (e) => {
            if (e.detail.value) {
              this._fetchTableDescription(grid, rowData.item.table.name, root.item);
            } else {
              this.grids[grid].gridElement.closeItemDetails(root.item);
            }
          });
        }
        root.item = rowData.item;
        root.firstElementChild.checked = this.grids[grid].gridElement.detailsOpenedItems.indexOf(root.item) > -1;
      };
      this.grids[grid].detailsElement.renderer = this.grids[grid].detailsElement.renderer.bind(this);
    }

    for (let grid in this.grids) {
      this._fetchAllTables(grid);
    }
  }

  _fetchTableDescription(whichGrid, tableName, gridItem) {
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
        this.grids[whichGrid].gridElement.openItemDetails(gridItem);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _fetchAllTables(grid) {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url = config.backEndUrl + this.grids[grid].apiEndpoint ;
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
        this._updateTableList(grid, this.tables)
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }
  _updateTableList(whichGrid) {
    let grid = this.grids[whichGrid].gridElement;
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
