import React, {useState, useEffect, useRef} from 'react';
import {fetchProperties} from '../api/client';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x250?text=No+Photo+Available';

//property filters
const initialFilterState = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: ''
};

function PropertyFilters({ onSearch, onClear, isLoading }) {
  const [filters, setFilters] = useState(initialFilterState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters(initialFilterState);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="filters-form" data-testid="property-filters-form">
      <div className="filter-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          placeholder="e.g. Portland"
          value={filters.city}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="zipcode">ZIP Code</label>
        <input
          id="zipcode"
          type="text"
          name="zipcode"
          placeholder="e.g. 97201"
          value={filters.zipcode}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Min Price</label>
        <input
          id="minPrice"
          type="number"
          name="minPrice"
          placeholder="$ Min"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max Price</label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          placeholder="$ Max"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="beds">Beds</label>
        <select id="beds" name="beds" value={filters.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="baths">Baths</label>
        <select id="baths" name="baths" value={filters.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" onClick={handleClear} disabled={isLoading}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}


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
  const [activeFilters, setActiveFilters] = useState({});

  //week 6 debug
  const currentRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++currentRequestId.current;

    async function loadListings() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchProperties(activeFilters);
        
        if (requestId === currentRequestId.current) {
          setProperties(data.results || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (requestId === currentRequestId.current) {
          setError(err.message || 'Failed to fetch property listings.');
        }
      } finally {
        if (requestId === currentRequestId.current) {
          setLoading(false);
        }
      }
    }

    loadListings();
  }, [activeFilters]);

  const handleSearch = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClear = () => {
    setActiveFilters({});
  };

  return (
    <div className="listings-container">
      <header className="listings-header">
        <h1>Property Listings</h1>
        {!loading && !error && (
          <p className="listings-count">
            Showing {properties.length} of {total} properties
          </p>
        )}
      </header>

      {/* Property Filters Component */}
      <PropertyFilters 
        onSearch={handleSearch} 
        onClear={handleClear} 
        isLoading={loading} 
      />

      {loading && (
        <div className="state-message">
          <p>Loading properties...</p>
        </div>
      )}

      {error && (
        <div className="state-message error-box">
          <p>Error: {error}</p>
          <button onClick={() => setActiveFilters({...activeFilters})}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.L_ListingID} property={property} />
            ))
          ) : (
            <p className="no-results">No properties match your filter criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}