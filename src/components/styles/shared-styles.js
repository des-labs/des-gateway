import { css } from 'lit-element';
export const SharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  paper-button.indigo {
    background-color: var(--paper-indigo-500);
    color: white;
    width: 150px;
    text-transform: none;
    --paper-button-raised-keyboard-focus: {
    background-color: var(--paper-indigo-a250) !important;
    color: white !important;
    };
  }
  paper-button[disabled] {
      background: #eaeaea;
      color: #a8a8a8;
      cursor: auto;
      pointer-events: none;
      /* box-shadow: 3px -3px 8px 8px rgba(184,184,184,0.7); */
  }
  paper-button.des-button {
      background-color: #3F51B5;
      color: white;
      width: 150px;
      text-transform: none;
      --paper-button-raised-keyboard-focus: {
        background-color: #3D5AFE !important;
        color: white !important;
      };
  }

  paper-button.des-button[disabled] {
    background: #eaeaea;
    color: #a8a8a8;
    cursor: auto;
    pointer-events: none;
}

  .container {
    text-align: center;
    @apply(--layout-horizontal);
    @apply(--layout-center-justified);
  }


  section {
    padding: 24px;
    background: var(--app-section-odd-color);
  }

  section > * {
    max-width: 1000px;
    /* margin-right: auto;
    margin-left: auto; */
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  h2 {
    font-size: 24px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color);
    color: var(--app-light-text-color);
    font-size: 30px;
    line-height: 64px;
  }

  .errormessage{
          display: block;
          color : red;
          font-size: 0.9em;
          text-align: center;
          word-wrap: break-word;
        }
`;
