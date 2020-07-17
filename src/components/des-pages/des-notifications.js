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
import '@polymer/paper-spinner/paper-spinner.js';

class DESNotifications extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  static get properties() {
    return {
      accessPages: {type: Array},
    };
  }

  constructor(){
    super();
    this.accessPages = [];
  }

  render() {
    return html`
      <section>
        <div style="font-size: 2rem; font-weight: bold;">
          DESaccess Notifications
          <paper-spinner class="big"></paper-spinner>
        </div>
        <div>
          <p>Manage notifications. <b>The page must be reloaded to refresh the data.</b></p>
        </div>
        <!--
          <paper-button @click="${(e) => {this.newUserDialog.opened = true; }}" class="des-button" raised style="font-size: 1rem; margin: 1rem; height: 2rem;"><iron-icon icon="vaadin:plus" style="height: 2rem; "></iron-icon>Add user</paper-button>
        -->
        <vaadin-grid .multiSort="${true}" style="height: 70vh; max-width: 85vw;">
          <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
          <vaadin-grid-column auto-width flex-grow="0" .renderer="${this._rendererTableIndex}" header="#"></vaadin-grid-column>
          <vaadin-grid-sort-column path="msg.id" header="ID" direction="desc"></vaadin-grid-sort-column>
          <vaadin-grid-filter-column path="msg.title" header="Title"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column path="msg.roles" header="Roles"></vaadin-grid-sort-column>
          <vaadin-grid-column path="msg.body" header="Message"></vaadin-grid-column>
          <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
        </vaadin-grid>
      </section>
      <vaadin-dialog id="delete-msg-dialog"></vaadin-dialog>
    `;
  }

  stateChanged(state) {
    this.accessPages = state.app.accessPages;
  }

  firstUpdated() {
    this.grid = this.shadowRoot.querySelector('vaadin-grid');
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers

    this._fetchAllMessages();
  }

  _rendererTableIndex(root, column, rowData) {
    root.textContent = rowData.index;
  }

  _headerRendererAction(root) {
    render(
      html`
        <a title="Actions"><iron-icon icon="vaadin:cogs"></iron-icon></a>
      `,
      root
    );
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
          <a title="Reset user ${rowData.item.msg.id}" href="#" onclick="return false;"><iron-icon @click="${(e) => { this.userToReset = rowData.item.msg.id; this.resetUserDialog.opened = true;}}" icon="vaadin:eraser" style="color: darkgray;"></iron-icon></a>
          <a title="Edit user ${rowData.item.msg.id}" href="#" onclick="return false;"><iron-icon @click="${(e) => {this.userEditDialog(rowData.item.user);}}" icon="vaadin:pencil" style="color: darkgray;"></iron-icon></a>
        `,
        container
      );
    } else {
      if (selected.map((e) => {return e.msg.id}).indexOf(rowData.item.msg.id) > -1) {
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

  _fetchAllMessages() {
    this.shadowRoot.querySelector('paper-spinner').active = true;
    const Url=config.backEndUrl + "notifications/fetch"
    let body = {
      'message': 'all'
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
        this.notifications = data.messages;
        this._updateTable(this.notifications);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }

  _updateTable(userRoles) {
    let grid = this.grid;
    let gridItems = [];
    // If there are no jobs in the returned list, allow an empty table
    if (this.notifications.length === 0) {
      grid.items = gridItems;
      return;
    }
    let ctr = 0;
    this.notifications.forEach((item, index, array) => {
      let msg = {};
      msg.id = item.id;
      msg.title = item.title;
      msg.message = item.body;
      msg.time = item.time;
      // TODO: Get roles associated with each message
      msg.roles = ['default'];
      gridItems.push({msg: msg});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.msg.id}).indexOf(grid.selectedItems[i].msg.id) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.msg.id}).indexOf(grid.items[i].msg.id) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        grid.recalculateColumnWidths();
        this.shadowRoot.querySelector('paper-spinner').active = false;
      }
    })
  }

}

window.customElements.define('des-notifications', DESNotifications);
