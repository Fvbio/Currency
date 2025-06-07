import { ApiService } from "./Class/ApiService.js";
import { Form } from "./Class/Form.js";

document.addEventListener('DOMContentLoaded', () => {
    const apiService = new ApiService();
    const form = new Form(apiService);
});