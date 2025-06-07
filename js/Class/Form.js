export class Form {
    constructor(apiService) {
        this.apiService = apiService;
        this.convertAmountInput = document.getElementById('convertAmount');
        this.resultSpan = document.querySelector('span');
        this.sourceCurrencySelect = document.getElementById('sourceCurrency');
        this.targetCurrencySelect = document.getElementById('targetCurrency');
        this.exchangeRates = null;
        this.init();
    }

    // Initialise l'application
    async init() {
        await this.loadCurrencies();
        this.setupEventListeners();
    }

    // Charge les devises depuis l'API
    async loadCurrencies() {
        try {
            const currencies = await this.apiService.getAvailableCurrencies();
            const rates = await this.apiService.getExchangeRates('USD');
            
            if (currencies.length > 0 && rates) {
                this.exchangeRates = rates;
                this.populateCurrencySelects(currencies);
            } else {
                this.showError('Impossible de charger les devises');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des devises:', error);
            this.showError('Erreur de connexion à l\'API');
        }
    }

    // Remplit les select avec les devises disponibles
    populateCurrencySelects(currencies) {
        // Vide les select avant de les remplir
        this.sourceCurrencySelect.innerHTML = '<option value="">Choisir une devise</option>';
        this.targetCurrencySelect.innerHTML = '<option value="">Choisir une devise</option>';
        
        // Ajoute chaque devise aux deux select
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            this.sourceCurrencySelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            this.targetCurrencySelect.appendChild(option2);
        });
    }

    // Configure les écouteurs d'événements
    setupEventListeners() {
        this.convertAmountInput.addEventListener('input', () => {
            this.performConversion();
        });
        this.sourceCurrencySelect.addEventListener('change', () => {
            this.performConversion();
        });
        this.targetCurrencySelect.addEventListener('change', () => {
            this.performConversion();
        });
    }

    // Effectue la conversion de devise
    performConversion() {
        const amount = parseFloat(this.convertAmountInput.value);
        const sourceCurrency = this.sourceCurrencySelect.value;
        const targetCurrency = this.targetCurrencySelect.value;
        
        // Vérifie que tous les champs sont remplis
        if (!amount || !sourceCurrency || !targetCurrency || !this.exchangeRates) {
            this.resultSpan.textContent = '0';
            return;
        }

        try {
            const convertedAmount = this.calculateConversion(amount, sourceCurrency, targetCurrency);
            this.resultSpan.style.color = 'black';
            this.resultSpan.textContent = convertedAmount.toFixed(2);
        } catch (error) {
            console.error('Erreur de conversion:', error);
            this.showError('Erreur de conversion');
        }
    }

    // Calcule la conversion entre deux devises
    calculateConversion(amount, fromCurrency, toCurrency) {
        if (!this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
            throw new Error('Devise non supportée');
        }

        // Conversion via USD comme devise de base
        const fromRate = this.exchangeRates[fromCurrency];
        const toRate = this.exchangeRates[toCurrency];
        
        return (amount / fromRate) * toRate;
    }

    showError(message) {
        this.resultSpan.textContent = `Erreur: ${message}`;
        this.resultSpan.style.color = 'red';
    }
}