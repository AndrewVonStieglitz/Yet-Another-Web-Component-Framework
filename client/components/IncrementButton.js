//@ts-check
class IncrementButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.count = 0;
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
          <style>
            button {
              /* Add any specific styles you want for your button here */
            }
          </style>
          <button id="increment-btn">${this.count}</button>
        `;
    }

    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
    if (this.shadowRoot) {
      const btn = this.shadowRoot.querySelector("#increment-btn");
      if (btn) { 
        btn.textContent = this.count.toString();
      }
    }
  }

  connectedCallback() {
    if (this.shadowRoot) {
      const btn = this.shadowRoot.querySelector("#increment-btn");
      if (btn) {
        btn.addEventListener("click", this.increment);
      }
    }
  }

  disconnectedCallback() {
    if (this.shadowRoot) {
      const btn = this.shadowRoot.querySelector("#increment-btn");
      if (btn) { 
        btn.removeEventListener("click", this.increment);
      }
    }
  }
}

if (!customElements.get('increment-button')) {
  customElements.define("increment-button", IncrementButton);
}
