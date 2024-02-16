//@ts-check
class RandomNumberGenerator extends HTMLElement {
    number = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (!this.shadowRoot) {
            throw new Error('Shadow root not found');
        }

        this.shadowRoot.innerHTML = `<button id="generate-btn">0</button>`;

        const generateBtn = this.shadowRoot.querySelector('#generate-btn');

        if (!generateBtn) {
            throw new Error('Button element not found');
        }

        generateBtn.addEventListener('click', () => {
            this.getRandomNumber();
        });
    }

    getRandomNumber() {
        fetch('/random-number')
            .then(response => response.json())
            .then(data => {
                this.number = data.number;
    
                if (!this.shadowRoot) {
                    throw new Error('Shadow root not found during fetch');
                }
    
                const generateBtn = this.shadowRoot.querySelector('#generate-btn');
                if (!(generateBtn instanceof HTMLElement)) {
                    throw new Error('Button element not found during fetch');
                }
                generateBtn.innerText = `${this.number}`;
            })
            .catch(error => console.error('Error:', error));
    }
}

customElements.define('random-number-generator', RandomNumberGenerator);