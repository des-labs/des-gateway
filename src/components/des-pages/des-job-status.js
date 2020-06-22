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
import '@polymer/paper-button/paper-button.js';


class DESJobStatus extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        .monospace-column {
          font-family: monospace;
          font-size: 0.8rem;
        }
        paper-button {
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
          };
        }
        paper-button.indigo {
          background-color: var(--paper-indigo-500);
          color: black;
          width: 150px;
          text-transform: none;
          --paper-button-raised-keyboard-focus: {
            background-color: var(--paper-indigo-a250) !important;
            color: white !important;
          };
        }
        `,

    ];
  }

  static get properties() {
    return {
      username: {type: String},
      jobIdFromUrl: {type: String},
      jobToDelete: {type: String},
      refreshStatusIntervalId: {type: Number},
      _selectedItems: {type: Array}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.jobIdFromUrl = '';
    this.jobToDelete = '';
    this.refreshStatusIntervalId = 0;
    this._selectedItems = [];
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererStatus = this._rendererStatus.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobId = this._headerRendererJobId.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobName = this._headerRendererJobName.bind(this); // need this to invoke class methods in renderers
    this._deleteConfirmDialogRenderer = this._deleteConfirmDialogRenderer.bind(this); // need this to invoke class methods in renderers
    this._rendererJobId = this._rendererJobId.bind(this); // need this to invoke class methods in renderers
    this._rendererJobName = this._rendererJobName.bind(this); // need this to invoke class methods in renderers

    // Define the datetime functions used by the update time indicator
    Date.prototype.today = function () {
        return this.getFullYear() + "/" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "/" + ((this.getDate() < 10)?"0":"") + this.getDate();
    }
    Date.prototype.timeNow = function () {
         return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
  }

  render() {
    return html`

    <section>
      <vaadin-grid .multiSort="${true}">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererStatus}" .headerRenderer="${this._headerRendererStatus}"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererAction}" .headerRenderer="${this._headerRendererAction}"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" text-align="center" .renderer="${this.rendererJobType}" .headerRenderer="${this._headerRendererJobType}"></vaadin-grid-column>
        <vaadin-grid-column width="25%" path="job.id"   .renderer="${this._rendererJobId}"   .headerRenderer="${this._headerRendererJobId}">  </vaadin-grid-column>
        <vaadin-grid-column width="40%" path="job.name" .renderer="${this._rendererJobName}" .headerRenderer="${this._headerRendererJobName}"></vaadin-grid-column>
      </vaadin-grid>
      <div id="last-updated" style="text-align: right; font-family: monospace;"></div>

    </section>
    <vaadin-dialog id="job-info-container"></vaadin-dialog>
    <vaadin-dialog id="deleteConfirmDialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
    `;
  }

  _headerRendererJobId(root) {
    render(
      html`
        <vaadin-grid-filter path="job.id">
          <vaadin-text-field slot="filter" focus-target label="Job ID" style="max-width: 100%" theme="small" value="${this.jobIdFromUrl}"></vaadin-text-field>
        </vaadin-grid-filter>
        <a title="Clear filter"><iron-icon icon="vaadin:close-circle-o" style="color: gray;"></iron-icon></a>
      `,
      root
    );
    root.querySelector('vaadin-text-field').addEventListener('value-changed', function(e) {
      root.querySelector('vaadin-grid-filter').value = e.detail.value;
      if (e.detail.value === '') {
        root.querySelector('iron-icon').style.display = 'none';
      } else {
        root.querySelector('iron-icon').style.display = 'inline-block';
      }
    });
    root.querySelector('iron-icon').addEventListener('click', function(e) {
      root.querySelector('vaadin-grid-filter').value = '';
      root.querySelector('vaadin-text-field').value = '';
    });
  }

  _headerRendererJobName(root) {
    render(
      html`
        <vaadin-grid-filter path="job.name">
          <vaadin-text-field slot="filter" focus-target label="Job Name" style="max-width: 100%" theme="small" value=""></vaadin-text-field>
        </vaadin-grid-filter>
        <a title="Clear filter"><iron-icon icon="vaadin:close-circle-o" style="color: gray;"></iron-icon></a>
      `,
      root
    );
    root.querySelector('vaadin-text-field').addEventListener('value-changed', function(e) {
      root.querySelector('vaadin-grid-filter').value = e.detail.value;
      if (e.detail.value === '') {
        root.querySelector('iron-icon').style.display = 'none';
      } else {
        root.querySelector('iron-icon').style.display = 'inline-block';
      }
    });
    root.querySelector('iron-icon').addEventListener('click', function(e) {
      root.querySelector('vaadin-grid-filter').value = '';
      root.querySelector('vaadin-text-field').value = '';
    });
  }

  _headerRendererAction(root) {
    render(
      html`
        <a title="Actions"><iron-icon icon="vaadin:cogs"></iron-icon></a>
      `,
      root
    );
  }

  _headerRendererStatus(root) {
    render(
      html`
      <vaadin-grid-sorter path="job.status">
        <a title="Job Status"><iron-icon icon="vaadin:dashboard"></iron-icon></a>
      </vaadin-grid-sorter>
      `,
      root
    );
  }

  _headerRendererJobType(root) {
    render(
      html`
      <vaadin-grid-sorter path="job.type">
        <a title="Job Type"><iron-icon icon="vaadin:cubes"></iron-icon></a>
      </vaadin-grid-sorter>
      `,
      root
    );
  }

  _showJobInfo(jobId) {
    const jobInfoPanel = this.shadowRoot.getElementById('job-info-container');
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    for (var i in grid.items) {
      if (grid.items[i].job.id === jobId) {
        console.log("job: " + JSON.stringify(grid.items[i].job));
        var job = grid.items[i].job;
        break;
      }
    }
    jobInfoPanel.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      render(
        html`
          <style>
            p {
              line-height: 0.8rem;
              color: black;
            }
            .monospace-column {
              font-family: monospace;
              font-size: 0.8rem;
            }
            .job-results-container {
              display: grid;
              grid-gap: 1rem;
              padding: 1rem;
              grid-template-columns: 20% 80%;
            }
          </style>
          <div style="overflow: auto;">
            <h3>Job Results</h3>
            <div class="job-results-container">
              <div>Name</div><div><span class="monospace-column">${job.name}</span></div>
              <div>ID</div><div><span class="monospace-column">${job.id}  </span></div>
              <div>Status</div><div>${job.status}</div>
              <div>Type</div><div>${job.type}</div>
              <div>Duration</div><div>${this._displayDuration(job.time_start, job.time_complete)} (${job.time_start} &mdash; ${job.time_complete})</div>
            </div>
          </div>
        `,
        container
      );
    }
    jobInfoPanel.opened = true;
  }

  _displayDuration(timeStart, timeComplete) {
    let durationInSeconds = Math.round((Date.parse(timeComplete) - Date.parse(timeStart))/1000);
    let seconds = -1;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let secondsInAMinute = 60;
    let secondsInAnHour = 60*secondsInAMinute;
    let secondsInADay = 24*secondsInAnHour;
    let remainingSeconds = durationInSeconds;
    let outString = '';
    let delimiter = ', '
    switch (true) {
      case (remainingSeconds >= secondsInADay):
        days = Math.floor(remainingSeconds/secondsInADay);
        remainingSeconds = remainingSeconds - secondsInADay*days;
        outString += `${days} days${delimiter}`
      case (remainingSeconds >= secondsInAnHour):
        hours = Math.floor(remainingSeconds/secondsInAnHour);
        remainingSeconds = remainingSeconds - secondsInAnHour*hours;
        outString += `${hours} hrs${delimiter}`
      case (remainingSeconds >= secondsInAMinute):
        minutes = Math.floor(remainingSeconds/secondsInAMinute);
        outString += `${minutes} min${delimiter}`
      default:
        seconds = remainingSeconds - secondsInAMinute*minutes;
        if (seconds >= 0) {
          outString += `${seconds} sec `
        }
    }
    return outString
  }

  _rendererJobId(root, column, rowData) {
    let monospaceText = rowData.item.job.id;
    render(
      html`
        <a href="#" onclick="return false;" @click="${(e) => {this._showJobInfo(rowData.item.job.id);}}"
        title="View details of job ${rowData.item.job.id.substring(0,8)}...">
          <span class="monospace-column">${monospaceText}</span>
        </a>
      `,
      root
    );
  }


  _rendererJobName(root, column, rowData) {
    let monospaceText = rowData.item.job.name;
    render(
      html`
        <a href="#" onclick="return false;" @click="${(e) => {this._showJobInfo(rowData.item.job.id);}}"
        title="View details of job ${rowData.item.job.id.substring(0,8)}...">
          <span class="monospace-column">${monospaceText}</span>
        </a>
      `,
      root
    );
  }

  _rendererAction(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    let that = this;
    // Assign the listener callback to a variable
    // TODO: Add a "cancel job" button that stops the process but does not delete the generated files.
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
            <a title="Delete Job ${rowData.item.job.id.substring(0,8)}..." onclick="return false;"><iron-icon @click="${(e) => {this._deleteJobConfirm(rowData.item.job.id)}}" icon="vaadin:trash" style="color: darkgray;"></iron-icon></a>
          `,
          container
        );
      } else {
        if (selected.map((e) => {return e.job.id}).indexOf(rowData.item.job.id) > -1) {
          render(
            html`
              <a title="Delete (${selected.length}) Selected Jobs" onclick="return false;"><iron-icon @click="${(e) => {this._deleteJobConfirm(rowData.item.job.id)}}" icon="vaadin:trash" style="color: red;"></iron-icon></a>
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
        var tooltip = 'Complete';
        break;
      case 'init':
      case 'started':
        var color = 'orange';
        var icon = 'vaadin:hourglass';
        var tooltip = 'In Progess';
        break;
      case 'failure':
      case 'unknown':
        var color = 'red';
        var icon = 'vaadin:close-circle-o';
        var tooltip = 'Failed';
        break;
      default:
        var color = 'purple';
        var icon = 'vaadin:question-circle-o';
        var tooltip = 'Error';
        break;
    }
    render(
      html`
        <a title="${tooltip}"><iron-icon icon="${icon}" style="color: ${color};"></iron-icon></a>
      `,
      container
    );

  }

  rendererJobType(root, column, rowData) {
    let container = root.firstElementChild;
    if (!container) {
      container = root.appendChild(document.createElement('div'));
    }
    switch (rowData.item.job.type) {
      case 'test':
        var color = 'black';
        var icon = 'vaadin:stopwatch';
        var type = 'Test';
        break;
      case 'query':
        var color = 'black';
        var icon = 'vaadin:code';
        var type = 'DB Query';
        break;
      case 'cutout':
        var color = 'black';
        var icon = 'vaadin:scissors';
        var type = 'Cutout';
        break;
      default:
        var color = 'purple';
        var icon = 'vaadin:question-circle-o';
        var type = 'Other';
        break;
    }
    render(
      html`
        <a title="Type: ${type}"><iron-icon icon="${icon}" style="color: ${color};"></iron-icon></a>
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
      job.time_start = item.job_time_start;
      job.time_complete = item.job_time_complete;
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

        // this._highlightJob(this.jobIdFromUrl);
        grid.recalculateColumnWidths();
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
    this._deleteJobConfirm(jobId);
  }

  _deleteJobConfirm(jobId) {
    this.jobToDelete = jobId;
    this.shadowRoot.getElementById('deleteConfirmDialog').opened = true;
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

  _deleteConfirmDialogRenderer(root, dialog) {
    let container = root.firstElementChild;
    if (container) {
      root.removeChild(root.childNodes[0]);
    }
    container = root.appendChild(document.createElement('div'));
    render(
      html`
      <div>
        <p>Are you sure?</p>
        <paper-button @click="${(e) => {dialog.opened = false; this._deleteJob(this.jobToDelete);}}" class="">Delete</paper-button>
        <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" style="color: #3f51b5;">Cancel</paper-button>
      </div>
      `,
      container
    );
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.jobIdFromUrl = state.app.jobId;
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
    // Delete job confirmation dialog renderer
    const dialog = this.shadowRoot.getElementById('deleteConfirmDialog');
    dialog.renderer = this._deleteConfirmDialogRenderer;
    // Trigger an immediate job status update upon page load
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
        // case 'jobIdFromUrl':
        //   console.log('jobIdFromUrl updated: ' + this.jobIdFromUrl);
        //   this._highlightJob(this.jobIdFromUrl);
        // break;
        case '_selectedItems':
          break;
        default:
          break
      }
    });
  }
}

window.customElements.define('des-job-status', DESJobStatus);
