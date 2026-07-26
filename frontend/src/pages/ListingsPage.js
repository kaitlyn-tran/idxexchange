import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x250?text=No+Photo+Available';

/**
 *  PropertyCard Component
 */
function PropertyCard({ property }) {
  const getPrimaryPhoto = () => {
    if (!property.L_Photos) return FALLBACK_IMAGE;

    try {
      const photos = typeof property.L_Photos === 'string' 
        ? JSON.parse(property.L_Photos) 
        : property.L_Photos;

      if (Array.isArray(photos) && photos.length > 0 && photos[0]) {
        return photos[0];
      }
    } catch (err) {
      console.warn(`Failed to parse photos for property ${property.L_ListingID}`, err);
    }

    return FALLBACK_IMAGE;
  };

  const formatPrice = (price) => {
    if (price == null || Number.isNaN(Number(price))) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="card-image-wrapper">
        <img 
          src={getPrimaryPhoto()} 
          alt={property.L_Address || 'Property'} 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="card-content">
        <h3 className="card-price">{formatPrice(property.L_SystemPrice)}</h3>
        
        <div className="card-specs">
            <span><strong>{property.L_Keyword2 ?? 0}</strong> beds</span> • 
            <span><strong>{property.LM_Dec_3 ?? 0}</strong> baths</span> • 
            <span><strong>{property.LM_Int2_3 ? property.LM_Int2_3.toLocaleString() : 0}</strong> sqft</span>
        </div>

        <p className="card-address">
            {property.L_Address || 'Address Unavailable'}<br />
            {property.L_City || ""}
            {property.L_City && property.L_State ? ", " : ""}
            {property.L_State || ""}
            {" "}
            {property.L_Zip || ""}
        </p>
      </div>
    </div>
  );
}

/**
 * ListingsPage Component
 */
export default function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadListings() {
        try {
            setLoading(true);
            setError(null);
            
            const data = await fetchProperties({ limit: 20, offset: 0 });
            
            if (isMounted) {
                setProperties(data.results || []);
                setTotal(data.total || 0);
            }
            } catch (err) {
            if (isMounted) {
                setError(err.message || 'Failed to fetch property listings.');
            }
            } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
        }

        loadListings();

        return () => {
            isMounted = false;
        };
    }, []);

  return (
    <div className="listings-container">
      <header className="listings-header">
        <h1>MLS Property Listings</h1>
        {!loading && !error && (
          <p className="listings-count">
            Showing {properties.length} of {total} properties
          </p>
        )}
      </header>

      {loading && (
        <div className="state-message">
          <p>Loading properties...</p>
        </div>
      )}

      {error && (
        <div className="state-message error-box">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.L_ListingID} property={property} />
            ))
          ) : (
            <p className="no-results">No properties found.</p>
          )}
        </div>
      )}
    </div>
  );
}