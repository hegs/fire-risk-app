/**
 * Geocoding Module
 * Handles converting street addresses to geographic coordinates (latitude, longitude)
 * using the OpenStreetMap Nominatim API.
 */

class GeocodingService {
    constructor() {
        this.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
    }

    /**
     * Geocodes a given address string.
     * @param {string} address The address to geocode.
     * @returns {Promise<Object>} A promise that resolves with the geocoding result.
     */
    async geocodeAddress(address) {
        const params = new URLSearchParams({
            q: address,
            format: 'json',
            countrycodes: 'us',
            // Restrict search to California bounding box for better results
            viewbox: '-124.48,42.01,-114.13,32.53',
            bounded: 1,
            limit: 1
        });

        const url = `${this.nominatimUrl}?${params.toString()}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    // Per Nominatim's usage policy, a custom User-Agent is recommended.
                    // Using a generic one for this example.
                    'User-Agent': 'FireRiskApp/1.0 (Student Project)'
                }
            });

            if (!response.ok) {
                throw new Error(`Geocoding service returned an error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error('Address not found. Please try a different address.');
            }

            const result = data[0];
            return {
                fullAddress: result.display_name,
                coordinates: {
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon)
                }
            };

        } catch (error) {
            console.error('Geocoding request failed:', error);
            // Re-throw the error to be handled by the caller
            throw error;
        }
    }
}

export const geocodingService = new GeocodingService(); 