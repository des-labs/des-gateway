import { html,css } from 'lit-element';
import { PageViewElement } from './des-base-page.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from '../styles/shared-styles.js';
import {config} from '../des-config.js';
import { store } from '../../store.js';
import { render } from 'lit-html';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';


class DESJobStatus extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        `,

    ];
  }

  static get properties() {
    return {
      username: {type: String},
      refreshStatusIntervalId: {type: Number},
      _selectedItems: {type: Array}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.refreshStatusIntervalId = 0;
    this._selectedItems = [];
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererStatus = this._rendererStatus.bind(this); // need this to invoke class methods in renderers
  }

  render() {
    return html`

    <section>
        <h2>Job status</h2>
      <vaadin-grid .multiSort="${true}">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-sort-column flex-grow="0" path="job.status" header="Status" .renderer="${this.rendererStatus}"></vaadin-grid-sort-column>
        <vaadin-grid-filter-column path="job.name" header="Job name" .renderer="${this._rendererJobId}"></vaadin-grid-filter-column>
        <vaadin-grid-column path="job.id" header="Job ID" .renderer="${this._rendererJobId}"></vaadin-grid-column>
        <vaadin-grid-sort-column flex-grow="0" path="job.type" header="Job type"></vaadin-grid-sort-column>
        <vaadin-grid-column text-align="end" flex-grow="0" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
      </vaadin-grid>
      <div id="last-updated" style="text-align: right; font-family: monospace;"></div>

    </section>

    `;
  }

  _headerRendererAction(root) {
    render(
      html`
        <iron-icon icon="vaadin:cogs"></iron-icon>
      `,
      root
    );
  }

  _rendererJobId(root, column, rowData) {
    let monospaceText = rowData.item.job.id;
    if (column.header == "Job name") {
      monospaceText = rowData.item.job.name;
    }
    render(
      html`
        <span style="font-family: monospace;">${monospaceText}</span>
      `,
      root
    );
  }
  // _deleteJobClickHandler(event, jobId) {
  //   this._deleteJob(jobId);
  // }
  // _cancelJobClickHandler(event, jobId) {
  //   this._cancelJob(jobId);
  // }
  _rendererAction(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    let that = this;
    // Assign the listener callback to a variable
    // if (rowData.item.job.status === "started" || rowData.item.job.status === "init") {
    if (false) {
      render(
        html`
          <a href="#" onclick="return false;"><iron-icon @click="${(e) => {this._cancelJob(rowData.item.job.id)}}" icon="vaadin:power-off" style="color: blue;"></iron-icon></a>
        `,
        container
      );
    } else {
      // var doClick = (event) => this._deleteJob(rowData.item.job.id);
      // container.removeEventListener('click', doClick);
      // container.addEventListener('click', doClick);
      let selected = this.shadowRoot.querySelector('vaadin-grid').selectedItems;
      if (selected.length === 0) {
        render(
          html`
            <a href="#" onclick="return false;"><iron-icon @click="${(e) => {this._deleteJob(rowData.item.job.id)}}" icon="vaadin:trash" style="color: darkgray;"></iron-icon></a>
          `,
          container
        );
      } else {
        if (selected.map((e) => {return e.job.id}).indexOf(rowData.item.job.id) > -1) {
          render(
            html`
              <a href="#" onclick="return false;"><iron-icon @click="${(e) => {this._deleteJob(rowData.item.job.id)}}" icon="vaadin:trash" style="color: red;"></iron-icon></a>
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
  }

  _rendererStatus(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    switch (rowData.item.job.status) {
      case 'success':
        var color = 'green';
        var icon = 'vaadin:check-circle-o';
        break;
      case 'init':
      case 'started':
        var color = 'orange';
        var icon = 'vaadin:hourglass';
        break;
      case 'failure':
      case 'unknown':
        var color = 'red';
        var icon = 'vaadin:close-circle-o';
        break;
      default:
        var color = 'purple';
        var icon = 'vaadin:question-circle-o';
        break;
    }
    render(
      html`
        <iron-icon icon="${icon}" style="color: ${color};"></iron-icon>
      `,
      container
    );

  }

  _updateStatus() {
    const Url=config.backEndUrl + "job/status"
    let body = {
      'job-id': 'all',
    };
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
        // console.log(JSON.stringify(data));
        that._updateGridData(data.jobs);
        that._updateLastUpdatedDisplay();
      } else {
        console.log(JSON.stringify(data));
      }
    });
  }

  _updateLastUpdatedDisplay() {

    let newDate = new Date();
    let datetime = "Last updated: " + newDate.today() + " @ " + newDate.timeNow();
    render(
      html`
        ${datetime}
      `,
      this.shadowRoot.getElementById('last-updated')
    );
  }

  _updateGridData(jobs) {
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    let gridItems = []
    // If there are no jobs in the returned list, allow an empty table
    if (jobs.length === 0) {
      grid.items = gridItems;
    }
    let ctr = 0
    jobs.forEach((item, index, array) => {
      let job = {};
      job.id = item.job_id;
      job.name = item.job_name;
      job.status = item.job_status;
      job.type = item.job_type;
      job.time_start = item.time_start;
      job.time_complete = item.time_complete;
      gridItems.push({job: job});
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(`grid.items: ${JSON.stringify(grid.items)}`);
        // let tempSelection = grid.selectedItems;
        // console.log(`selectedItems (${grid.selectedItems.length}): ${JSON.stringify(grid.selectedItems)}`);
        // grid.selectedItems = [];
        // console.log(`selectedItems (${tempSelection.length}): ${JSON.stringify(tempSelection)}`);
        let dedupSelItems = [];
        for (var i in grid.selectedItems) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.selectedItems[i].job.id) < 0) {
            dedupSelItems.push(grid.selectedItems[i]);
          }
        }
        grid.selectedItems = [];
        for (var i in grid.items) {
          if (dedupSelItems.map((e) => {return e.job.id}).indexOf(grid.items[i].job.id) > -1) {
            grid.selectItem(grid.items[i]);
          }
        }
        // let tempSelection = this._selectedItems;
        // grid.selectedItems = this._selectedItems;
        // console.log(`selectedItems: ${JSON.stringify(tempSelection)}`);
        // for (var itemIdx in grid.items) {
          // console.log(`grid items index: ${itemIdx}: ${JSON.stringify(grid.items[itemIdx])}, selectedItems index match: ${this._selectedItems.indexOf(grid.items[itemIdx])}`);
          // if (tempSelection.indexOf(grid.items[itemIdx]) > -1) {
          // console.log(`${tempSelection.map((e) => {return e.job.id}).indexOf(grid.items[itemIdx].job.id)}`);
          // for (var selItemsIdx in tempSelection) {
          //   if (tempSelection[selItemsIdx].job.id == grid.items[itemIdx].job.id) {
          //     console.log(`grid item ${JSON.stringify(grid.items[itemIdx].job.id)} is selected`)
          //     // grid.selectItem(grid.items[itemIdx]);
          //     grid.selectedItems.push(grid.items[itemIdx]);
          //   }
          // }
          // if (tempSelection.map((e) => {return e.job.id}).indexOf(grid.items[itemIdx].job.id) > -1) {
          //   grid.selectItem(grid.items[itemIdx]);
          // }
          // else {
          //   grid.deselectItem(grid.items[itemIdx]);
          // }
        // }
        // tempSelection = grid.selectedItems;
        // this._selectedItems = tempSelection;
      }
    })
  }

  _cancelJob(jobId) {
    this._deleteJob(jobId);
  }

  _deleteJob(jobId) {
    let grid = this.shadowRoot.querySelector('vaadin-grid');
    let jobIds = [];
    if (grid.selectedItems.length === 0 ) {
      jobIds.push(jobId);
    } else {
      if (grid.selectedItems.map((e) => {return e.job.id}).indexOf(jobId) > -1) {
        for (let i in grid.selectedItems) {
          jobIds.push(grid.selectedItems[i].job.id);
        }
      }
    }
    for (let i in jobIds) {
      let jobId = jobIds[i];
      console.log(`Deleting job "${jobId}"...`);
      const Url=config.backEndUrl + "job/delete"
      let body = {
        'job-id': jobId,
      };
      const param = {
        method: "DELETE",
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
          // console.log(JSON.stringify(data));
          that._updateStatus();
        } else {
          console.log(JSON.stringify(data));
        }
      });
    }
  }

  stateChanged(state) {
    this.username = state.app.username;
    this._page = state.app.page;
    if (this.refreshStatusIntervalId === 0) {
      this.refreshStatusIntervalId = window.setInterval(() => {
        if (this._page === 'status') {
          this._updateStatus();
        }
      }, 5000);
    }
  }

  firstUpdated() {
    // For todays date;
    Date.prototype.today = function () {
        return this.getFullYear() + "/" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "/" + ((this.getDate() < 10)?"0":"") + this.getDate();
    }

    // For the time now
    Date.prototype.timeNow = function () {
         return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
    // var that = this;
    // this.shadowRoot.querySelector('vaadin-grid').addEventListener('selected-items-changed', function(event) {
    //   console.log(JSON.stringify(event));
    //   that._selectedItems = that.shadowRoot.querySelector('vaadin-grid').selectedItems;
    //   // console.log(`selectedItems: ${JSON.stringify(that._selectedItems)}`);
    // });
    // this.shadowRoot.querySelector('vaadin-grid').addEventListener('deselected-items-changed', function(event) {
    //   console.log(JSON.stringify(event));
    //   that._selectedItems = that.shadowRoot.querySelector('vaadin-grid').selectedItems;
    //   // console.log(`selectedItems: ${JSON.stringify(that._selectedItems)}`);
    // });
    this._updateStatus();
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${oldValue}`);
      switch (propName) {
        case 'active':
          if (this.active) {
            this._updateStatus()
          }
          break;
        case '_selectedItems':
          break;
        default:
          break
      }
    });
  }
}

window.customElements.define('des-job-status', DESJobStatus);
