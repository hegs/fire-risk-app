/**
 * @file fire-risk-api.js
 * @description This module provides functionality to interact with the CAL FIRE FHSZ API.
 * It fetches fire hazard data based on geographical coordinates.
 */

/**
 * Queries a single layer of the CAL FIRE FHSZ API.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @param {number} layerId - The ID of the layer to query.
 * @returns {Promise<string|null>} A promise that resolves to the hazard class or null.
 */
async function queryLayer(latitude, longitude, layerId) {
  const arcgisApiUrl = `https://services.gis.ca.gov/arcgis/rest/services/Environment/Fire_Severity_Zones/MapServer/${layerId}/query`;

  const params = new URLSearchParams({
    geometry: `${longitude},${latitude}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'HAZ_CLASS',
    returnGeometry: 'false',
    f: 'json'
  });

  const requestUrl = `${arcgisApiUrl}?${params.toString()}`;
  // if (layerId === 0) { // Log the base request once for debugging
  //   console.log(`Querying CAL FIRE API for ${latitude}, ${longitude}`);
  // }

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      console.error(`API request for layer ${layerId} failed with status ${response.status}`);
      return null;
    }
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].attributes.HAZ_CLASS;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching fire risk data for layer ${layerId}:`, error);
    return null;
  }
}

/**
 * Fetches the fire risk level for a given latitude and longitude from the CAL FIRE FHSZ API.
 * Queries multiple layers and returns the highest risk level found.
 *
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<string>} A promise that resolves to the highest fire risk level found.
 */
export async function getFireRisk(latitude, longitude) {
  const layerIds = [0, 1, 2]; // SRA, LRA, and VHFHSZ layers
  const riskPromises = layerIds.map(id => queryLayer(latitude, longitude, id));

  try {
    const results = await Promise.all(riskPromises);
    const validResults = results.filter(r => r); // Filter out null/empty results

    if (validResults.length === 0) {
      return 'Not in a designated hazard zone';
    }

    const riskValues = {
      "Very High": 3,
      "High": 2,
      "Moderate": 1
    };

    let maxRiskValue = 0;
    let bestResultText = '';

    for (const result of validResults) {
      for (const levelName in riskValues) {
        if (result.includes(levelName)) {
          const currentRiskValue = riskValues[levelName];
          if (currentRiskValue > maxRiskValue) {
            maxRiskValue = currentRiskValue;
            bestResultText = result;
          }
        }
      }
    }
    
    // If no recognized risk level was found, return the first result we got.
    // Otherwise, return the text associated with the highest risk found.
    return bestResultText || validResults[0];

  } catch (error) {
    console.error('Error processing fire risk results:', error);
    return 'Could not determine fire risk';
  }
} 