import React, {useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import {fetchPropertyById, fetchOpenHouses} from '../api/client';

import PropertyImageGallery from '../components/PropertyImageGallery';
import PropertyMap from '../components/PropertyMap';
import OpenHouseList from '../components/OpenHouseList';

function PropertyDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      setLoading(true);
      setError('');

      try {
        const propertyData = await fetchPropertyById(id);

        const openHouseData = await fetchOpenHouses(id);

        if (cancelled) {
          return;
        }

        let loadedProperty = propertyData;

        if (propertyData.property) {
          loadedProperty = propertyData.property;
        }

        let loadedOpenHouses = openHouseData;

        if (openHouseData.openhouses) {
          loadedOpenHouses = openHouseData.openhouses;
        }

        if (openHouseData.openHouses) {
          loadedOpenHouses = openHouseData.openHouses;
        }

        setProperty(loadedProperty);

        if (Array.isArray(loadedOpenHouses)) {
          setOpenHouses(loadedOpenHouses);
        } else {
          setOpenHouses([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || 'Unable to load property.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="detail-page">
        <p>Loading property...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Listings
        </button>

        <div className="error-message">
          <h2>Unable to load property</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="detail-page">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Listings
        </button>

        <p>Property not found.</p>
      </main>
    );
  }

  const price = Number(property.L_SystemPrice || 0);

  return (
    <main className="detail-page">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="back-button"
      >
        ← Back to Listings
      </button>

      <PropertyImageGallery
        photos={property.L_Photos}
      />

      <section className="property-detail-info">
        <h1>
          ${price.toLocaleString()}
        </h1>

        <h2>
          {property.L_Address || 'Address unavailable'}
        </h2>

        <p className="detail-location">
          {property.L_City || ''}
          {property.L_City && property.L_State ? ', ' : ''}
          {property.L_State || ''}
          {' '}
          {property.L_Zip || ''}
        </p>

        <div className="detail-stats">
          <div>
            <strong>
              {property.L_Keyword2 || 0}
            </strong>
            <span>Beds</span>
          </div>

          <div>
            <strong>
              {property.LM_Dec_3 || 0}
            </strong>
            <span>Baths</span>
          </div>

          <div>
            <strong>
              {Number(
                property.LM_Int2_3 || 0
              ).toLocaleString()}
            </strong>
            <span>Sqft</span>
          </div>

          <div>
            <strong>
              {property.YearBuilt || 'N/A'}
            </strong>
            <span>Year Built</span>
          </div>
        </div>
      </section>

      <section className="property-description">
        <h2>Description</h2>

        <p>
          {property.L_Remarks ||
            'No description available.'}
        </p>
      </section>

      <section className="property-details">
        <h2>Property Details</h2>

        <div className="details-grid">
          <div>
            <strong>Listing ID</strong>
            <span>
              {property.L_ListingID}
            </span>
          </div>

          <div>
            <strong>Lot Size</strong>
            <span>
              {property.LotSizeAcres
                ? `${property.LotSizeAcres} acres`
                : 'N/A'}
            </span>
          </div>

          <div>
            <strong>City</strong>
            <span>
              {property.L_City || 'N/A'}
            </span>
          </div>

          <div>
            <strong>State</strong>
            <span>
              {property.L_State || 'N/A'}
            </span>
          </div>

          <div>
            <strong>ZIP</strong>
            <span>
              {property.L_Zip || 'N/A'}
            </span>
          </div>
        </div>
      </section>

      <PropertyMap
        latitude={property.LMD_MP_Latitude}
        longitude={property.LMD_MP_Longitude}
      />

      <OpenHouseList
        openHouses={openHouses}
      />
    </main>
  );
}

export default PropertyDetailPage;