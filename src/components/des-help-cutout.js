import { LitElement, html, css } from 'lit-element';
import { HelpStyles } from './styles/shared-styles.js';
import { scrollToTop } from './utils.js';

class DESHelpCutout extends LitElement {
  static get styles() {
    return [
      HelpStyles
    ];
  }

  render() {
    return html`
      <a href="#" onclick="return false;" title="Back to top" style="text-decoration: none; color: inherit;">
      <h3 @click="${scrollToTop}">
        Cutout Service Help
        <iron-icon icon="vaadin:angle-double-up"></iron-icon>
      </h3></a>
      <p>The Cutout Service allows you to download raw or color image data based on input coordinates and areal dimensions.</p>
      <div class="help-content-grid">
        <div>
          <p>
            Select the data release tag associated with the data set you
            wish to access. In the text box, enter the positions in the sky
            that designate the centers of your cutout images. The text must
            be CSV-formatted, with a header row containing either <b>RA,DEC</b>
            or <b>COADD_OBJECT_ID</b>, specifying whether subsequent rows
            contain ID numbers for the desired Coadd tiles or sky coordinates
            in RA/DEC units.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/cutout-release-and-positions.png">
        </div>
        <div>
          <p>
            Select the FITS format to generate raw data files. You will
            generate one FITS file for each color band selected (if available).
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/cutout-fits.png">
        </div>
        <div>
          <p>
            Select one or both of the color image formats to generate files suitable
            for visual inspection. Two color rendering methods are offered:
            <b>STIFF</b> and <b>Lupton</b>.
          </p>
          <p>
            Exactly three color bands must be selected. To change the default selection,
            first deselect some bands to enable selection of the ones you want.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/cutout-color-image.png">
        </div>
        <div>
          <p>
            The areal dimensions of the requested cutout images are specified in units
            of arcminutes.
          </p>
          <p>
            You may optionally include <b>XSIZE</b> and <b>YSIZE</b> columns in
            the positions CSV-formatted text if you wish to request
            different areal dimensions for each requested cutout.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/cutout-size.png">
        </div>
        <div>
          <p>
            Specifying a custom job name can help make it easier to filter
            the job list on the <b>Job Status</b> page to find one or more jobs.
          </p>
          <p>
            To be notified when your job is complete, select the <b>Email when Complete</b>
            option and ensure that the email address is correct.
          </p>
        </div>
        <div class="image-container">
          <img src="images/help/cutout-options.png">
        </div>
      </div>
    `;
  }
}

window.customElements.define('des-help-cutout', DESHelpCutout);
