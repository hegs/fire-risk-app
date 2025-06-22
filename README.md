# Fire Risk Lookup Web App

A simple web application that enables insurance agents to quickly determine the wildfire risk rating for any California property address. This tool serves as the first step in the insurance cost determination process, providing immediate access to authoritative fire risk data from CAL FIRE's Fire Hazard Severity Zones (FHSZ) layer.

## Features

- Address input and geocoding
- Interactive map display
- Fire risk assessment using CAL FIRE data
- Clean, responsive interface
- Fast response times (< 10 seconds)

## Project Structure

```
fire-risk-app/
├── src/
│   ├── js/          # Main JavaScript files
│   ├── css/         # Stylesheets
│   └── modules/     # JavaScript modules
├── tests/           # Unit tests
├── tasks/           # Project documentation and task lists
├── server.py        # Development server
├── start-server.sh  # Server startup script
├── config.js        # Application configuration
└── index.html       # Main HTML file
```

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
./start-server.sh
```

### Option 2: Using Python directly
```bash
python3 server.py
```

### Option 3: Using Python's built-in server
```bash
python3 -m http.server 8000
```

The application will be available at: **http://localhost:8000**

## Development

### Prerequisites
- Python 3.6+ (for development server)
- Modern web browser with ES6+ support

### Development Server Features
- ✅ CORS enabled for all origins
- ✅ Proper MIME types for all file types
- ✅ Auto-refresh on file changes
- ✅ Detailed request logging
- ✅ Error handling and debugging
- ✅ Port 8000 (configurable)

### File Structure
- **`index.html`** - Main application entry point
- **`src/css/styles.css`** - Application styling
- **`src/js/app.js`** - Main application logic
- **`src/modules/`** - Modular JavaScript components
- **`config.js`** - Application configuration
- **`server.py`** - Development server with CORS support

### Configuration
The application uses `config.js` for all configuration including:
- API endpoints and keys
- Service providers (Nominatim, Google Maps, etc.)
- Map providers (Leaflet, Mapbox)
- Error messages and user feedback
- Feature flags and environment settings

## Data Sources

- **CAL FIRE Fire Hazard Severity Zones (FHSZ)** - Primary fire risk data
- **OpenStreetMap Nominatim** - Free geocoding service
- **Google Maps Geocoding API** - Alternative geocoding (requires API key)
- **Leaflet.js with OpenStreetMap** - Free mapping solution
- **Mapbox** - Alternative mapping (requires API key)

## API Keys (Optional)

For enhanced functionality, you can configure API keys:

### Google Maps API Key
```javascript
// In config.js or via environment variable
config.geocoding.fallback.apiKey = 'your-google-maps-api-key';
```

### Mapbox API Key
```javascript
// In config.js or via environment variable
config.map.alternative.apiKey = 'your-mapbox-api-key';
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

[Add license information here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request 