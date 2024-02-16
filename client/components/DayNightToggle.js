class DayNightToggle extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM tree to the custom element
      this.attachShadow({ mode: 'open' });
      // Add inner HTML structure with styles and the toggle button
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .toggle-container {
          width: 80px;
          height: 40px;
          border-radius: 20px;
          background: linear-gradient(to right, #48C6EF 50%, #6F86D6 50%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          cursor: pointer;
          position: relative;
          transition: background 0.4s ease;
        }

        .toggle-knob {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 30px;
          height: 30px;
          background-color: #fff;
          border-radius: 50%;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-container.night .toggle-knob {
          transform: translateX(40px);
        }

        .icon {
          width: 24px;
          height: 24px;
          transition: opacity 0.3s ease;
        }

        .sun {
          opacity: 1;
        }

        .moon {
          opacity: 0;
          position: absolute;
        }

        .toggle-container.night .sun {
          opacity: 0;
        }

        .toggle-container.night .moon {
          opacity: 1;
        }
      </style>
      
      <div class="toggle-container">
        <div class="toggle-knob">
          <svg class="icon sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="yellow"></circle>
            <g stroke="yellow" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </g>
          </svg>
          <svg class="icon moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.7 13.29c-1.1-3.39-4.35-5.75-8-5.75-4.96 0-9 4.04-9 9s4.04 9 9 9c3.65 0 6.9-2.36 8-5.75-3.31 1.56-7.06-.47-8.62-3.78-1.56-3.31.47-7.06 3.78-8.62 1.11-.52 2.33-.85 3.55-.85.75 0 1.48.07 2.19.22 2.31.49 4.26 2.44 4.74 4.74.15.71.22 1.44.22 2.19 0 1.22-.33 2.44-.85 3.55z" fill="#f1c40f"></path>
          </svg>
        </div>
      </div>
    </style>
        

      `;

      // Toggle functionality
      this.shadowRoot.querySelector('.toggle-container').addEventListener('click', () => {
        this.shadowRoot.querySelector('.toggle-container').classList.toggle('night');
      });
    }
  }

  // Define the custom element
  customElements.define('day-night-toggle', DayNightToggle);