class IncrementButton extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root to the element.
    this.attachShadow({ mode: "open" });
    // Initialize count
    this.count = 0;
    // Setup the initial HTML structure and styles
    this.shadowRoot.innerHTML = `
        <style>
          button {
            /* Add any specific styles you want for your button here */
          }
        </style>
        <button id="increment-btn">${this.count}</button>
      `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#increment-btn").addEventListener("click", () => {
        this.count++;
        this.shadowRoot.querySelector("#increment-btn").textContent = this.count;
      });
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("#increment-btn").removeEventListener("click");
  }
}

// Define the new element, checking if it's not already defined to avoid redefinition errors
if (!customElements.get('increment-button')) {
  customElements.define("increment-button", IncrementButton);
}
