class RandomNumberGenerator extends HTMLElement {
    constructor() {
        super();
        this.number = 0; 
        this.attachShadow({ mode: 'open' }); 
        this.shadowRoot.innerHTML = `
            <button id="generate-btn">0</button>
        `;
        
        // Add event listener to the button
        this.shadowRoot.querySelector('#generate-btn').addEventListener('click', () => {
            this.getRandomNumber();
        });
    }

    getRandomNumber() {
        fetch('/random-number')
            .then(response => response.json())
            .then(data => {
                this.number = data.number;
                this.shadowRoot.querySelector('#generate-btn').innerText = `${this.number}`;
            })
            .catch(error => console.error('Error:', error));
    }
}

// Define the custom element
customElements.define('random-number-generator', RandomNumberGenerator);