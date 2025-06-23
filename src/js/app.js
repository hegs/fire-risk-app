/**
 * @file app.js
 * @description Main application logic for the Fire Risk Assessment app.
 */

import { AddressValidator } from '../modules/validation.js';
import { geocodingService } from '../modules/geocoding.js';
import { getFireRisk } from '../modules/fire-risk-api.js';
import { displayMap, clearMap, invalidateMapSize } from '../modules/map.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const addressForm = document.getElementById('address-form');
    const addressInput = document.getElementById('address-input');
    const submitBtn = document.getElementById('submit-btn');
    
    const searchSection = document.getElementById('search-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsContainer = document.getElementById('results-container');
    const errorSection = document.getElementById('error-section');
    
    const riskDisplay = document.getElementById('risk-display');
    const resultAddress = document.getElementById('result-address');
    const dataSource = document.getElementById('data-source');
    const errorMessage = document.getElementById('error-message');
    const tryAgainBtn = document.getElementById('try-again-btn');

    const validator = new AddressValidator();

    // --- State Management ---
    const showSection = (section) => {
        searchSection.classList.add('hidden');
        loadingSection.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        errorSection.classList.add('hidden');
        if (section) {
            section.classList.remove('hidden');
        }
    };

    const resetUI = () => {
        showSection(searchSection);
        addressInput.value = '';
        submitBtn.disabled = true;
        addressInput.classList.remove('valid', 'invalid');
        clearMap();
    };

    // --- Event Handlers ---
    addressInput.addEventListener('input', () => {
        const validation = validator.validate(addressInput.value);
        submitBtn.disabled = !validation.isValid;
    });

    addressForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = addressInput.value.trim();
        if (!validator.validate(address).isValid) return;

        showSection(loadingSection);

        try {
            const geocodeData = await geocodingService.geocodeAddress(address);
            if (!geocodeData || !geocodeData.coordinates) {
                throw new Error('Could not find coordinates for the address. Please try a different address.');
            }
            
            const { lat, lon } = geocodeData.coordinates;
            const fireRisk = await getFireRisk(lat, lon);
            
            displayResults(fireRisk, geocodeData);
            displayMap(lat, lon);
            
            showSection(resultsContainer);
            invalidateMapSize();

        } catch (error) {
            console.error('Error during address processing:', error);
            errorMessage.textContent = error.message || 'An unexpected error occurred. Please try again.';
            showSection(errorSection);
        }
    });

    tryAgainBtn.addEventListener('click', resetUI);

    // --- UI Update Functions ---
    const getRiskInfo = (riskLevel) => {
        const normalizedRisk = (riskLevel || 'unknown').toLowerCase().replace(/\s+/g, '-');
        const riskInfo = {
            'very-high': {
                title: 'Very High Risk',
                description: 'This area has a very high risk of wildfire according to CAL FIRE\'s assessment.',
                icon: 'alert-triangle',
            },
            'high': {
                title: 'High Risk',
                description: 'This area has a high risk of wildfire according to CAL FIRE\'s assessment.',
                icon: 'alert-triangle',
            },
            'moderate': {
                title: 'Moderate Risk',
                description: 'This area has a moderate risk of wildfire according to CAL FIRE\'s assessment.',
                icon: 'alert-triangle',
            },
            'low': {
                title: 'Low Risk',
                description: 'This area has a low risk of wildfire according to CAL FIRE\'s assessment.',
                icon: 'shield-check',
            },
            'not-in-designated-hazard-zone': {
                title: 'Not in Hazard Zone',
                description: 'This location is not currently in a designated high fire hazard zone.',
                icon: 'check-circle',
            },
             'unknown': {
                title: 'Risk Not Available',
                description: 'Fire risk data is not available for this specific location.',
                icon: 'help-circle',
            }
        };
        return riskInfo[normalizedRisk] || riskInfo['unknown'];
    };
    
    const displayResults = (fireRisk, geocodeData) => {
        const normalizedRisk = (fireRisk || 'unknown').toLowerCase().replace(/\s+/g, '-');
        const { title, description, icon } = getRiskInfo(normalizedRisk);
        
        const iconSvg = {
            'alert-triangle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            'shield-check': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 22 5"></polyline></svg>`,
            'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            'help-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        };

        riskDisplay.className = `risk-level-${normalizedRisk}`;
        riskDisplay.innerHTML = `
            <div class="icon">${iconSvg[icon]}</div>
            <div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

        resultAddress.textContent = geocodeData.fullAddress;
        dataSource.textContent = 'CAL FIRE Fire Hazard Severity Zones (FHSZ)';
    };

    // --- Initial State ---
    resetUI();
}); 