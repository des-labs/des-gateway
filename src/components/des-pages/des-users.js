import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { SharedStyles } from '../styles/shared-styles.js';
import { config } from '../des-config.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';

class DESUsers extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
      grid: {type: Object}
    };
  }

  constructor(){
    super();
    this.accessPages = [];
    this.grid = null;
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">DESaccess User Management</div>
        <vaadin-grid .multiSort="${true}" style="height: 70vh;">
          <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
          <vaadin-grid-column path="user.name" .renderer="${this._rendererJobId}"   header="Username">  </vaadin-grid-column>
          <vaadin-grid-column path="user.roles" .renderer="${this._rendererJobName}" header="Roles"></vaadin-grid-column>
        </vaadin-grid>
      </section>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    this._fetchUserList();
  }


  _fetchUserList() {
    const Url=config.backEndUrl + "page/users/list"
    let body = {};
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(body)
    };
    var that = this;
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        console.log(JSON.stringify(data.users, null, 2));
        that._updateUserTable(data.users);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _updateUserTable(users) {
    let grid = this.grid;
    let gridItems = [];
    // If there are no jobs in the returned list, allow an empty table
    if (users.length === 0) {
      grid.items = gridItems;
    }
    let ctr = 0;
    users.forEach((item, index, array) => {
      let user = {};
      user.name = item.username;
      user.roles = item.roles;
      gridItems.push({user: user});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.user.name}).indexOf(grid.selectedItems[i].user.name) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.user.name}).indexOf(grid.items[i].user.name) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
      }
    })
  }
}

window.customElements.define('des-users', DESUsers);
