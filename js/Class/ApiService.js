export class ApiService {
    constructor() {
        this.apiKey = "eddfc0429189eb02509d0eb0";
        this.baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}`;
    }

    // Récupère les taux de change pour une devise source
    async getCurrency(currency) {
        try {
            const url = `${this.baseUrl}/latest/${currency}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des taux :", error);
            return null;
        }
    }

    // Récupère uniquement la liste des devises disponibles
    async getAvailableCurrencies() {
        const data = await this.getCurrency('USD'); // Utilise USD comme base
        return data ? Object.keys(data.conversion_rates) : [];
    }

    // Récupère les taux de conversion spécifiques
    async getExchangeRates(baseCurrency = 'USD') {
        const data = await this.getCurrency(baseCurrency);
        return data ? data.conversion_rates : null;
    }
}