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
import { loadPage, updateQuery } from '../../actions/app.js';


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
      query: {type: String},
      jobIdFromUrl: {type: String},
      jobToDelete: {type: String},
      refreshStatusIntervalId: {type: Number},
      initialJobInfoPopup: {type: Boolean},
      accessPages: {type: Array},
      _selectedItems: {type: Array}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.query = '';
    this.jobIdFromUrl = '';
    this.initialJobInfoPopup = true;
    this.jobToDelete = '';
    this.refreshStatusIntervalId = 0;
    this.accessPages = [];
    this._selectedItems = [];
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererStatus = this._rendererStatus.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobId = this._headerRendererJobId.bind(this); // need this to invoke class methods in renderers
    this._headerRendererJobName = this._headerRendererJobName.bind(this); // need this to invoke class methods in renderers
    this._deleteConfirmDialogRenderer = this._deleteConfirmDialogRenderer.bind(this); // need this to invoke class methods in renderers
    this._rendererJobId = this._rendererJobId.bind(this); // need this to invoke class methods in renderers
    this._rendererJobName = this._rendererJobName.bind(this); // need this to invoke class methods in renderers
    this._jobRenameDialog = this._jobRenameDialog.bind(this); // need this to invoke class methods in renderers

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
    <vaadin-dialog id="job-rename-dialog"></vaadin-dialog>
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

  _copyQueryToDbAccessPage(event, query, dialog) {
    query = query.replace(/(  )+/g, '\n');
    // console.log(`Updating query to ${query}`);
    store.dispatch(updateQuery(query));
    store.dispatch(loadPage('db-access', this.accessPages));
    dialog.opened = false;
  }

  _jobRenameDialog(jobInfo, message='') {
    const jobDialogPanel = this.shadowRoot.getElementById('job-rename-dialog');
    jobDialogPanel.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }
      let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      viewportHeight = viewportHeight === 0 ? 300 : viewportHeight;
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
        </style>
          <div style="">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <p style="display: ${message === '' ? 'none' : 'block'}; color: red;">${message}</p>
            <paper-input id="new-job-name-input" ?invalid="${message !== ''}" always-float-label label="New job name" placeholder=${jobInfo.name}></paper-input>
            <paper-button @click="${(e) => {dialog.opened = false; this._renameJob(jobInfo, document.getElementById('new-job-name-input').value);}}" class="des-button" raised>Rename</paper-button>
            <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
          </div>
        `,
        container
      );
    }
    jobDialogPanel.opened = true;
  }

  _showJobInfo(jobId) {
    const jobInfoPanel = this.shadowRoot.getElementById('job-info-container');
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    for (var i in grid.items) {
      if (grid.items[i].job.id === jobId) {
        // console.log("job: " + JSON.stringify(grid.items[i].job));
        var job = grid.items[i].job;
        break;
      }
    }
    jobInfoPanel.renderer = (root, dialog) => {
      let container = root.firstElementChild;
      if (!container) {
        container = root.appendChild(document.createElement('div'));
      }

      let taskSpecificInfo = null;
      switch (job.type) {
        case 'query':
          if (job.query_files !== null) {
            var numFiles = job.query_files.length;
          } else {
            var numFiles = 0;
          }
          taskSpecificInfo = html`
            <div>Query
              <a title="Copy query to editor" href="#" onclick="return false;">
                <iron-icon @click="${(e) => {this._copyQueryToDbAccessPage(e, job.query, dialog)}}" icon="vaadin:copy-o" style="color: darkblue; margin-left: 2rem;"></iron-icon>
              </a>
            </div>
            <div>
              <textarea rows="6" style="border: 1px solid #CCCCCC; font-family: monospace; width: 80%;">${job.query.replace(/(  )+/g, '\n')}</textarea>
            </div>
            <div>Files (${numFiles})</div><div style="overflow: auto; height: 300px;"><span class="monospace-column">
            ${job.query_files === null ?
              html``:
              html`
                <ul style="list-style-type: square; margin: 0; padding: 0;">
                  ${job.query_files.map(i => html`<li><a href="${config.frontEndUrl}files/${this.username}/query/${job.id}/${i}">${i}</a></li>`)}
                </ul>
              `
            }
            </span></div>
          `;
          break;
        case 'cutout':
          if (job.cutout_files !== null) {
            var numFiles = job.cutout_files.length;
          } else {
            var numFiles = 0;
          }
          taskSpecificInfo = html`
            <div>Files (${numFiles})</div><div style="overflow: auto; height: 300px;"><span class="monospace-column">
            ${job.cutout_files === null ?
              html``:
              html`
                <ul style="list-style-type: square; margin: 0; padding: 0;">
                  ${job.cutout_files.map(i => html`<li><a href="${config.frontEndUrl}files/${this.username}/cutout/${i}">${i.split('/').splice(1).join('/')}</a></li>`)}
                </ul>
              `
            }
            </span></div>
          `;
          break;
        default:
          taskSpecificInfo = html``;
          break;
      }
      let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      viewportHeight = viewportHeight === 0 ? 600 : viewportHeight;
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
          <div style="overflow: auto; width: 1000px; height: ${0.9*viewportHeight}px;">
            <a title="Close" href="#" onclick="return false;">
              <iron-icon @click="${(e) => {dialog.opened = false;}}" icon="vaadin:close" style="position: absolute; top: 2rem; right: 2rem; color: darkgray;"></iron-icon>
            </a>
            <h3>Job Results</h3>
            <div class="job-results-container">
              <div>Name</div><div><span class="monospace-column">${job.name}</span></div>
              <div>ID</div><div><span class="monospace-column">${job.id}  </span></div>
              <div>Status</div><div>${job.status}</div>
              <div>Type</div><div>${job.type}</div>
              <div>Duration</div><div>${this._displayDuration(job.time_start, job.time_complete)} (${job.time_start} &mdash; ${job.time_complete})</div>
              ${taskSpecificInfo}
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
        <style>
        .edit-icon {
          --iron-icon-width: 1rem;
          --iron-icon-height: 1rem;
        }
        </style>
        <a href="#" onclick="return false;" @click="${(e) => {this._jobRenameDialog(rowData.item.job);}}"
        title="Rename job">
          <span  style="font-size: 0.8rem; color: black;"><iron-icon class="edit-icon" icon="vaadin:pencil"></iron-icon></span>
        </a>&nbsp;
        <a href="#" onclick="return false;" @click="${(e) => {this._showJobInfo(rowData.item.job.id);}}"
        title="View details of job ${rowData.item.job.id.substring(0,8)}...">
          <span class="monospace-column">${monospaceText}</span>
        </a>
      `,
      root
    );
  }

  _renameJob(jobInfo, newJobName) {
    console.log(jobInfo);
    var isValidJobName = newJobName === '' || (newJobName.match(/^[a-z0-9]([-a-z0-9]*[a-z0-9])*(\.[a-z0-9]([-a-z0-9]*[a-z0-9])*)*$/g) && newJobName.length < 129);
    if (!isValidJobName) {
      this._jobRenameDialog(jobInfo, 'Invalid job name');
      return;
    }
    const Url=config.backEndUrl + "job/rename"
    let body = {
      'job-id': jobInfo.id,
      'job-name': newJobName
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
        // console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
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
        // console.log(JSON.stringify(data, null, 2));
        that._updateGridData(data.jobs);
        that._updateLastUpdatedDisplay();
      } else {
        console.log(JSON.stringify(data, null, 2));
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
      job.data = typeof(item.data) === 'string' ? JSON.parse(item.data) : null;
      job.query = item.query;
      job.query_files = typeof(item.query_files) === 'string' ? JSON.parse(item.query_files) : null;
      job.cutout_files = typeof(item.cutout_files) === 'string' ? JSON.parse(item.cutout_files) : null;
      if (job.type !== 'query' || job.data === null) {
        gridItems.push({job: job});
      }
      ctr++;
      if (ctr === array.length) {
        grid.items = gridItems;
        // console.log(JSON.stringify(gridItems, null, 2));
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
        grid.recalculateColumnWidths();
        if (this.jobIdFromUrl !== '' && this.initialJobInfoPopup) {
          this.initialJobInfoPopup = false;
          this._showJobInfo(this.jobIdFromUrl);
        }
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

      </style>
      <div>
        <p style="text-align: center;font-size: 1.2rem;">Are you sure?</p>
        <paper-button @click="${(e) => {dialog.opened = false; this._deleteJob(this.jobToDelete);}}" class="des-button" raised>Delete</paper-button>
        <paper-button @click="${(e) => {dialog.opened = false;}}" class="indigo" raised>Cancel</paper-button>
      </div>
      `,
      container
    );
  }

  stateChanged(state) {
    this.username = state.app.username;
    this.query = state.app.query;
    this.jobIdFromUrl = state.app.jobId;
    this._page = state.app.page;
    this.accessPages = state.app.accessPages;
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
        case '_selectedItems':
          break;
        default:
          break
      }
    });
  }
}

window.customElements.define('des-job-status', DESJobStatus);
