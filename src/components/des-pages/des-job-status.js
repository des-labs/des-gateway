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
      refreshStatusIntervalId: {type: Number}
    };
  }

  constructor(){
    super();
    this.username = '';
    this.refreshStatusIntervalId = 0;
    this.rendererAction = this._rendererAction.bind(this); // need this to invoke class methods in renderers
    this.rendererStatus = this._rendererStatus.bind(this); // need this to invoke class methods in renderers
  }

  render() {
    return html`

    <section>
        <h2>Job status</h2>
      <vaadin-grid .multiSort="${true}">
        <vaadin-grid-sort-column path="job.status" header="Status" .renderer="${this.rendererStatus}"></vaadin-grid-sort-column>
        <vaadin-grid-filter-column path="job.name" header="Job name" .renderer="${this._rendererJobId}"></vaadin-grid-filter-column>
        <vaadin-grid-sort-column path="job.type" header="Job type"></vaadin-grid-sort-column>
        <vaadin-grid-column path="job.id" header="Job ID" .renderer="${this._rendererJobId}"></vaadin-grid-column>
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
    if (rowData.item.job.status === "started" || rowData.item.job.status === "init") {
      // var doClick = (event) => this._cancelJob(rowData.item.job.id);
      // container.addEventListener('click', function (event) {
      //   that._cancelJob(rowData.item.job.id);
      // });
      // container.removeEventListener('click', doClick);
      // container.addEventListener('click', doClick);
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
      render(
        html`
          <a href="#" onclick="return false;"><iron-icon @click="${(e) => {this._deleteJob(rowData.item.job.id)}}" icon="vaadin:trash" style="color: darkgray;"></iron-icon></a>
        `,
        container
      );
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
    const Url=config.backEndUrl + config.apiPath +  "/job/status"
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
    let gridItems = []
    let ctr = 0
    // If there are no jobs in the returned list, allow an empty table
    if (jobs.length === 0) {
      this.shadowRoot.querySelector('vaadin-grid').items = gridItems;
    }
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
        this.shadowRoot.querySelector('vaadin-grid').items = gridItems;
      }
    })
  }

  _cancelJob(jobId) {
    console.log(`Canceling job "${jobId}"...`);
  }

  _deleteJob(jobId) {
    console.log(`Deleting job "${jobId}"...`);
    const Url=config.backEndUrl + config.apiPath +  "/job/delete"
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
        console.log(JSON.stringify(data));
        that._updateStatus();
      } else {
        console.log(JSON.stringify(data));
      }
    });
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
    this._updateStatus();
  }
}

window.customElements.define('des-job-status', DESJobStatus);
