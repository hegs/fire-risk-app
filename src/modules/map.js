/**
 * @file map.js
 * @description This module handles the creation and management of the Leaflet map.
 */

let map = null;

/**
 * Initializes the map or updates its view if it already exists.
 *
 * @param {number} lat - The latitude for the map center.
 * @param {number} lon - The longitude for the map center.
 * @param {number} zoom - The zoom level for the map.
 */
export function displayMap(lat, lon, zoom = 15) {
  if (!map) {
    map = L.map('map').setView([lat, lon], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  } else {
    map.setView([lat, lon], zoom);
  }

  // Clear existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Add a marker to the map
  L.marker([lat, lon]).addTo(map)
    .bindPopup('Approximate Location')
    .openPopup();
}

/**
 * Recalculates map size when its container is resized.
 */
export function invalidateMapSize() {
  if (map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 10);
  }
}

/**
 * Clears the map and hides the container.
 */
export function clearMap() {
    if (map) {
        map.remove();
        map = null;
    }
} 