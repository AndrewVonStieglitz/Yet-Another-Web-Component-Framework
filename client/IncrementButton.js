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
            padding: 10px;
            font-size: 16px;
            margin: 5px;
          }
        </style>
        <button id="increment-btn">Click me</button>
        <span id="count-display">0</span>
      `;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#increment-btn")
      .addEventListener("click", () => {
        this.count++;
        this.shadowRoot.querySelector("#count-display").textContent =
          this.count;
      });
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#increment-btn")
      .removeEventListener("click");
  }
}

// Define the new element
customElements.define("increment-button", IncrementButton);
