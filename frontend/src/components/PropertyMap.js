import React from 'react';

function PropertyMap({latitude, longitude}) {
  if (!latitude || !longitude) {
    return null;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="map-error">
        Google Maps API key is not configured.
      </div>
    );
  }

  const mapUrl =
    `https://www.google.com/maps/embed/v1/place` +
    `?key=${apiKey}` +
    `&q=${latitude},${longitude}` +
    `&zoom=15`;

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${latitude},${longitude}`;

  return (
    <section className="property-map-section">
      <h2>Location</h2>

      <div className="property-map">
        <iframe
          title="Property location"
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="directions-link"
      >
        Get Directions
      </a>
    </section>
  );
}

export default PropertyMap;