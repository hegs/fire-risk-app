/**
 * @file app.js
 * @description Main application logic for the Fire Risk Lookup app.
 */

import { AddressValidator } from '../modules/validation.js';
import { geocodingService } from '../modules/geocoding.js';
import { getFireRisk } from '../modules/fire-risk-api.js';
import { displayMap } from '../modules/map.js';

document.addEventListener('DOMContentLoaded', () => {
  const addressForm = document.getElementById('address-form');
  const addressInput = document.getElementById('address-input');
  const submitBtn = document.getElementById('submit-btn');
  const clearBtn = document.getElementById('clear-btn');
  const addressError = document.getElementById('address-error');
  const exampleBtns = document.querySelectorAll('.example-btn');

  const loadingSection = document.getElementById('loading-section');
  const resultsSection = document.getElementById('results-section');
  const errorSection = document.getElementById('error-section');
  const errorMessage = document.getElementById('error-message');
  const tryAgainBtn = document.getElementById('try-again-btn');
  const riskDisplay = document.getElementById('risk-display');
  const mapContainer = document.getElementById('map-container');
  
  const addressInputSection = document.getElementById('address-input-section');
  const validator = new AddressValidator();

  /**
   * Returns a brief explanation of what each fire risk category means
   * @param {string} riskLevel - The fire risk level
   * @returns {string} Explanation of the risk category
   */
  const getRiskExplanation = (riskLevel) => {
    const explanations = {
      'very-high': 'Very High Fire Hazard Zone: Areas with the highest risk of wildfire. These areas typically have dense vegetation, steep slopes, and limited access for firefighting. Extreme caution and preparedness are essential.',
      'high': 'High Fire Hazard Zone: Areas with significant wildfire risk due to vegetation, terrain, or weather patterns. Regular fire safety measures and evacuation planning are recommended.',
      'moderate': 'Moderate Fire Hazard Zone: Areas with moderate wildfire risk. While less severe than high-risk areas, fire safety precautions should still be maintained.',
      'low': 'Low Fire Hazard Zone: Areas with minimal wildfire risk. These areas typically have limited vegetation or are in urban settings with good fire protection infrastructure.',
      'not-in-designated-hazard-zone': 'Not in a Designated Hazard Zone: This location is not currently classified in a formal fire hazard zone. However, fire safety awareness is always recommended.'
    };
    
    const normalizedRisk = riskLevel.toLowerCase().replace(/\s+/g, '-');
    return explanations[normalizedRisk] || 'Risk level information not available.';
  };

  const updateUIState = (state) => {
    loadingSection.style.display = state === 'loading' ? 'block' : 'none';
    resultsSection.style.display = state === 'results' ? 'block' : 'none';
    errorSection.style.display = state === 'error' ? 'block' : 'none';
    addressForm.style.display = state === 'input' ? 'block' : 'none';
    if (state === 'input') {
      addressInput.value = '';
      submitBtn.disabled = true;
      mapContainer.style.display = 'none';
    }
  };

  const showLoadingState = (message) => {
    loadingSection.querySelector('p').textContent = message;
    updateUIState('loading');
  };

  const showResultsState = (htmlContent) => {
    riskDisplay.innerHTML = htmlContent;
    updateUIState('results');
  };

  const showErrorState = (message) => {
    errorMessage.textContent = message;
    updateUIState('error');
  };

  const checkAddressValidity = () => {
    const validation = validator.validate(addressInput.value);
    submitBtn.disabled = !validation.isValid;
    
    clearBtn.style.display = addressInput.value.length > 0 ? 'inline-block' : 'none';

    if (!validation.isValid && addressInput.value.length > 0 && document.activeElement !== addressInput) {
        addressError.textContent = validation.errors.length > 0 ? validation.errors[0].message : 'Invalid address';
        addressError.style.display = 'block';
    } else {
        addressError.textContent = '';
        addressError.style.display = 'none';
    }
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    const address = addressInput.value.trim();

    const validation = validator.validate(address);
    if (!validation.isValid) {
      return;
    }
    
    showLoadingState('Geocoding address...');

    try {
      const geocodeData = await geocodingService.geocodeAddress(address);
      if (geocodeData && geocodeData.coordinates) {
        showLoadingState('Assessing fire risk...');
        const fireRisk = await getFireRisk(geocodeData.coordinates.lat, geocodeData.coordinates.lon);

        const riskLevelClass = fireRisk ? fireRisk.toLowerCase().replace(/\s+/g, '-') : 'unknown';
        const riskText = fireRisk || 'Not Available';
        
        const riskExplanation = getRiskExplanation(fireRisk);
        
        const resultsHTML = `
          <p><strong>Address:</strong> ${geocodeData.fullAddress}</p>
          <p><strong>Fire Risk:</strong> <span class="risk-level-${riskLevelClass}">${riskText}</span></p>
          <p><strong>Explanation:</strong> ${riskExplanation}</p>
        `;
        
        showResultsState(resultsHTML);
        displayMap(geocodeData.coordinates.lat, geocodeData.coordinates.lon);

      } else {
        showErrorState('Could not find coordinates for the address. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding or Fire Risk API error:', error);
      showErrorState(error.message || 'An unexpected error occurred.');
    }
  };

  addressForm.addEventListener('submit', handleAddressSubmit);
  addressInput.addEventListener('input', checkAddressValidity);
  addressInput.addEventListener('blur', checkAddressValidity);
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      updateUIState('input');
    });
  }

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) {
    startOverBtn.addEventListener('click', () => {
      updateUIState('input');
    });
  }

  tryAgainBtn.addEventListener('click', () => {
    updateUIState('input');
  });

  exampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        addressInput.value = e.target.dataset.address;
        checkAddressValidity();
    });
  });

  // Initial state setup
  updateUIState('input');
  checkAddressValidity();
}); 