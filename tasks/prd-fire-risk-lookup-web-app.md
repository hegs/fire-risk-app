# Product Requirements Document: Fire Risk Lookup Web App

## Introduction/Overview

The Fire Risk Lookup Web App is a simple, single-purpose web application that enables insurance agents to quickly determine the wildfire risk rating for any California property address. This tool serves as the first step in the insurance cost determination process, providing immediate access to authoritative fire risk data from CAL FIRE's Fire Hazard Severity Zones (FHSZ) layer.

The app addresses the critical need for insurance professionals to efficiently assess property fire risk without requiring specialized GIS knowledge or complex data analysis tools. By providing instant, reliable fire risk categorization, the app streamlines the insurance quoting process and improves decision-making accuracy.

## Goals

1. **Enable rapid fire risk assessment** - Provide fire risk ratings for any California address within 10 seconds of submission
2. **Simplify insurance workflow** - Eliminate the need for manual GIS queries or external data lookups during insurance assessments
3. **Ensure data accuracy** - Leverage official CAL FIRE data sources to provide authoritative risk classifications
4. **Improve user experience** - Create an intuitive, single-purpose interface that requires minimal training
5. **Support business efficiency** - Reduce time spent on property risk assessment from minutes to seconds

## User Stories

1. **As an insurance agent**, I want to input a California property address so that I can quickly determine its wildfire risk category for insurance cost calculations.

2. **As an insurance agent**, I want to see the property location on a map so that I can verify the address is correct and understand the geographic context of the risk assessment.

3. **As an insurance agent**, I want to see the data source citation so that I can provide authoritative documentation to clients and underwriters.

4. **As an insurance agent**, I want to get results within 10 seconds so that I can maintain efficient workflow during client consultations.

## Functional Requirements

1. **Address Input Form**
   - The system must provide a text input field for entering California street addresses
   - The system must include a submit button to initiate the risk assessment
   - The system must validate that the address field is not empty before submission

2. **Address Geocoding**
   - The system must convert the entered address to latitude/longitude coordinates using Google Maps Geocoding API or OpenStreetMap (Nominatim)
   - The system must handle common address formats and variations
   - The system must provide clear error messages for invalid or non-existent addresses

3. **Map Display**
   - The system must display a static map showing the geocoded location
   - The system must place a marker at the exact coordinates of the address
   - The system must use Mapbox or Leaflet.js for map rendering
   - The system must show sufficient geographic context around the property location

4. **Fire Risk Data Query**
   - The system must query the CAL FIRE FHSZ (Fire Hazard Severity Zones) ArcGIS REST service using the geocoded coordinates
   - The system must perform a spatial point-in-polygon query to determine the fire risk zone
   - The system must retrieve the fire risk category (Moderate, High, or Very High)
   - The system must capture the data source information for citation purposes

5. **Result Display**
   - The system must prominently display the fire risk category in large, readable text
   - The system must show the property location marker on the map
   - The system must display the data source citation (e.g., "CAL FIRE FHSZ layer")
   - The system must provide a brief explanation of what the risk category means

6. **Error Handling**
   - The system must handle cases where the address cannot be geocoded
   - The system must handle cases where the location falls outside CAL FIRE data coverage
   - The system must handle cases where the geocoding service is unavailable
   - The system must provide user-friendly error messages for all failure scenarios

## Non-Goals (Out of Scope)

- User authentication or account management
- Data storage or history of previous searches
- Support for addresses outside California
- Mobile app development
- Integration with insurance company systems
- Historical fire data or trends
- Risk mitigation recommendations
- Evacuation route information
- Multiple overlapping risk zone display
- Export or sharing functionality
- Advanced map interactions (zoom, pan, etc.)

## Design Considerations

- **Minimalist Interface**: Focus on functionality over design polish
- **Clear Visual Hierarchy**: Risk category should be the most prominent element
- **Static Map Display**: Simple map showing location without interactive features
- **Responsive Design**: Ensure usability on desktop and tablet devices
- **Loading States**: Provide clear feedback during geocoding and data query processes
- **Error States**: Design clear error messages that guide users to correct input

## Technical Considerations

- **Frontend Stack**: HTML, CSS, JavaScript (React optional)
- **Geocoding Service**: Google Maps Geocoding API or OpenStreetMap Nominatim
- **Mapping Library**: Mapbox or Leaflet.js
- **Data Source**: CAL FIRE ArcGIS REST service (FHSZ layer)
- **Spatial Query**: Point-in-polygon analysis for risk zone determination
- **CORS Handling**: Ensure proper handling of cross-origin requests to external services
- **API Rate Limits**: Implement appropriate handling for geocoding and mapping service limits

## Success Metrics

- **Response Time**: 90% of queries return results within 10 seconds
- **Accuracy**: 100% of displayed risk categories match official CAL FIRE data
- **Usability**: Insurance agents can successfully assess risk without training
- **Reliability**: 99% uptime during business hours
- **Error Rate**: Less than 5% of valid California addresses fail to return results

## Open Questions

1. **Geocoding Service Selection**: Should we use Google Maps Geocoding API (paid, more accurate) or OpenStreetMap Nominatim (free, potentially less accurate)?

2. **Map Provider**: Should we use Mapbox (paid, better performance) or Leaflet.js with OpenStreetMap tiles (free)?

3. **Error Recovery**: What should happen if the CAL FIRE service is temporarily unavailable?

4. **Address Validation**: Should we implement additional address validation beyond geocoding success/failure?

5. **Performance Optimization**: Should we implement caching for frequently searched addresses?

6. **Future Expansion**: What is the timeline for expanding beyond California addresses? 