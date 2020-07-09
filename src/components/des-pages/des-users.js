import { html,css } from 'lit-element';
import { render } from 'lit-html';
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
          <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
          <vaadin-grid-column path="user.roles" .renderer="${this._rendererJobName}" header="Roles"></vaadin-grid-column>
        </vaadin-grid>
      </section>
      <vaadin-dialog id="edit-user-dialog"></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.userEditDialog = this._userEditDialog.bind(this); // need this to invoke class methods in renderers
    this._fetchUserList();
  }

  _headerRendererAction(root) {
    render(
      html`
        <a title="Actions"><iron-icon icon="vaadin:cogs"></iron-icon></a>
      `,
      root
    );
  }

  _getRolesForUser(username) {
    let roles = [];
    for (let i in this.grid.items) {
      if (username === this.grid.items[i].user.name) {
        roles = this.grid.items[i].user.roles
        break;
      }
    }
    return roles;
  }

  _rendererAction(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    let selected = this.grid.selectedItems;
    if (selected.length === 0) {
      render(
        html`
          <a title="Edit user ${rowData.item.user.name}..." onclick="return false;"><iron-icon @click="${(e) => {this.userEditDialog(rowData.item.user);}}" icon="vaadin:pencil" style="color: darkgray;"></iron-icon></a>
        `,
        container
      );
    } else {
      if (selected.map((e) => {return e.user.name}).indexOf(rowData.item.user.name) > -1) {
        render(
          html`
            <a title="Edit (${selected.length}) Selected Users" onclick="return false;"><iron-icon @click="${(e) => {this.userEditDialog(rowData.item.user);}}" icon="vaadin:pencil" style="color: red;"></iron-icon></a>
          `,
          container
        );
      } else {
        render(
          html``,
          container
        );

      }
    }
  }

  _userEditDialog(userInfo) {
    const editUserDialog = this.shadowRoot.getElementById('edit-user-dialog');
    editUserDialog.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      // Different behavior if applying to selection of users
      let placeholderText = userInfo.roles.join(', ');
      let classList = '';
      let headerText = `Update user: ${userInfo.name}`;
      if (this.grid.selectedItems.length > 0) {
        placeholderText = 'CAUTION: Roles will apply to ALL users!!';
        classList = 'warning-text';
        headerText = `Updating ALL SELECTED user roles! [not yet supported]`;
      }
      render(
        html`
          <style>
            paper-button {
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.indigo {
              background-color: var(--paper-indigo-500);
              color: white;
              width: 100px;
              text-transform: none;
              --paper-button-raised-keyboard-focus: {
                background-color: var(--paper-indigo-a250) !important;
                color: white !important;
              };
            }
            paper-button.des-button {
                background-color: white;
                color: black;
                width: 100px;
                text-transform: none;
                --paper-button-raised-keyboard-focus: {
                  background-color: white !important;
                  color: black !important;
                };
            }
           .warning-text {
             color: red;
           }
          </style>
          <div style="width: 50vw">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3 class="${classList}">${headerText}</h3>
            <paper-input id="roles-input" always-float-label label="Update assigned roles" class="${classList}" value="${placeholderText}" placeholder="${placeholderText}"></paper-input>

            <paper-button @click="${(e) => {dialog.opened = false; this._setUserRoles(userInfo, document.getElementById('roles-input').value);}}" class="des-button" raised>Apply</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
          </div>
        `,
        container
      );
    }
    editUserDialog.opened = true;
  }

  _setUserRoles(userInfo, newRolesStr) {
    // TODO: Support bulk role update for multiple selected users
    if (this.grid.selectedItems.length > 0) {
      return;
    }
    let roles = [];
    // Convert input CSV string to array, trimming surrounding whitespace and replacing remaining whitespace with underscores
    let newRoles = newRolesStr.split(',');
    for (let i in newRoles) {
      let newRole = newRoles[i].trim().replace(/\s/g, "_");
      if (newRole !== '') {
        roles.push(newRole);
      }
    }
    newRoles = roles;
    if (newRoles === userInfo.roles) {
      return;
    }
    const Url=config.backEndUrl + "user/update/roles"
    let body = {
      'username': userInfo.name,
      'new_roles': newRoles
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
      if (data.status === "ok") {
        // console.log(JSON.stringify(data.users, null, 2));
        this._fetchUserList();
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
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
    fetch(Url, param)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status === "ok") {
        // console.log(JSON.stringify(data.users, null, 2));
        this._updateUserTable(data.users);
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
