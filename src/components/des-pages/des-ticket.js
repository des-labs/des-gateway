import { html,css } from 'lit-element';
import { PageViewElement } from '../page-view-element.js';
import { SharedStyles } from '../shared-styles.js';

class DESTicket extends PageViewElement {
  static get properties() {
    return {
      // This is the data from the store.
      _clicks: { type: Number },
      _value: { type: Number },
      resetchecked: { type: Boolean, attribute: true},
      unlockchecked: { type: Boolean, attribute: true},
      msg: {type: String},
      message: {type: String}
    };
  }

  static get styles() {
    return [
      SharedStyles,
    ];
  }

 
 constructor(){
   super();
   this.username = "";
   this.search = "";
   this.email = "";
   this.jiraticket = "";
   this.searchstring = "";
   this.message = "";
   this.status = "";
   this.msg = "";
   
}

updateResetChecked(e) {
  this.resetchecked = e.target.checked;
}
updateUnlockChecked(e) {
  this.unlockchecked = e.target.checked;

}

  render() {
    return html`

      <section>
        <div>
        <h2>DES Ticket</h2>
        <center>
        <h5>A DESDM database password and DESHELP JIRA ticket resolver</h5>
        </center>
        </div>
        <br>
        <br>
       <div>
          <p>Enter username, email, first or last name to check if user exists.</p>
          <table id="search-table" style="width:100%">
          <tr class="submit-tr">
          <td class="submit-td">
            Search:
          </td>
          <td class="submit-td">
          <input value="${this.search}" @input="${e => this.search = e.target.value}">
          </td>
          </tr>
          <tr class="submit-tr">
          <td class="submit-td">
          </td>
          <td class="submit-td">
          <button @click="${this._search}">Search</button>
          </td>
          </tr>
          </table>
          <pre> ${this.message}</pre>
        </div>
        <div>
          <p> Enter username or email below to resolve db password request.</p>
          <table id="form-submission-table" style="width:100%">
            <tr class="submit-tr">
            <td class="submit-td">
              Username:
            </td>
            <td class="submit-td">
            <input value="${this.username}" @input="${e => this.username = e.target.value}">
            </td>
            </tr>
            <tr class="submit-tr">
            <td class="submit-td">
              Email:
            </td>
            <td class="submit-td">
            <input value="${this.email}" @input="${e => this.email = e.target.value}">
            </td>
            </tr>
            <tr class="submit-tr">
            <td class="submit-td">
              JIRA ticket:
            </td>
            <td class="submit-td">
            <input value="${this.jiraticket}" @input="${e => this.jiraticket = e.target.value}">
            </td>
            </tr>
            <tr class="submit-tr">
            <td class="submit-td">
              Resolution options:
            </td>
            <td class="submit-td">
            <input type="checkbox" id="reset" name="reset" ?checked="${this.checked}"
                @change="${this.updateResetChecked}"/>
            <label for="reset">Reset/unlock</label>
            <input type="checkbox" id="unlock" name="unlock" ?checked="${this.checked}"
            @change="${this.updateUnlockChecked}"/>
            <label for="unlock">Unlock only</label>
            </td>
            </tr>
            <tr class="submit-tr">
            <td class="submit-td">
            </td>
            <td class="submit-td">
            <button @click="${this._submit}">Submit</button>
            </td>
            </tr>
          </table>          
        </div>
        <p><font color="red">${this.msg}</font></p>
      </section>

    `;
  }

  _search(){
    console.log("_search");
    const Url="https://deslabs.ncsa.illinois.edu:32000/desticket/api/v1/search/";
    const dataP={
      search_string: this.searchstring,
    };
    const param = {
      headers: {'Content-Type': 'application/json',
          },
      body: JSON.stringify(dataP),
      method: "POST"
    };
    fetch(Url, param)
    .then(response => {return response.json();})
    .then(data => {this.message = data.message;})
    .catch((error) => {console.log(error);});
  }

    _exists(){
      console.log(this.name);
      const Url="https://deslabs.ncsa.illinois.edu:32000/desticket/api/v1/exists/";
      const dataP={
        username: this.username,
        email: this.email,
      };
      const param = {
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(dataP),
        method: "POST"
      };
      fetch(Url, param)
      .then(response => {return response.json();})
      .then(data => {this.username = data.user;
                      this.email = data.email;
                      this.count = data.count;})
      .catch((error) => {console.log(error);});
    }

  _submit(){
    console.log("_submit");
    const Url="https://deslabs.ncsa.illinois.edu:32000/desticket/api/v1/reset/";
    const dataP={
      username: this.username,
      email: this.email,
      jiraticket: this.jira_ticket,
      reset: this.resetchecked,
    };
    const param = {
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(dataP),
      method: "POST"
    };

    if (this.resetchecked == this.unlockchecked){
      this.msg = "Please select only one resolution option!"
      console.log(this.msg)
    }
    else {
      this.msg=""
      fetch(Url, param)
      .then(response => {return response.json();})
      .then(data => {this.message = data.message;
                   this.status = data.status;})
      .catch((error) => {console.log(error);});
    }
  }
  
}

window.customElements.define('des-ticket', DESTicket);
