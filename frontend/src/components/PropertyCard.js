import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const getPrimaryPhoto = () => {
    if (!property.L_Photos) {
      return null;
    }

    try {
      const photos =
        typeof property.L_Photos === 'string'
          ? JSON.parse(property.L_Photos)
          : property.L_Photos;

      if (Array.isArray(photos)) {
        const validPhotos = photos.filter(
          (photo) => typeof photo === 'string' && photo.trim()
        );

        if (validPhotos.length > 0) {
          return validPhotos[0];
        }
      }
    } catch {
      return null;
    }

    return null;
  };

  const formatPrice = (price) => {
    if (
      price == null ||
      Number.isNaN(Number(price))
    ) {
      return '$0';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const primaryPhoto = getPrimaryPhoto();

  return (
    <Link
      to={`/property/${property.L_ListingID}`}
      className="property-card-link"
    >
      <div className="property-card">
        <div className="card-image-wrapper">
          {primaryPhoto ? (
            <img
              src={primaryPhoto}
              alt={property.L_Address || 'Property'}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="no-photo">
              <span>No Photo Available</span>
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-price">
            {formatPrice(property.L_SystemPrice)}
          </h3>

          <div className="card-specs">
            <span>
              <strong>{property.L_Keyword2 ?? 0}</strong> beds
            </span>{' '}
            •{' '}
            <span>
              <strong>{property.LM_Dec_3 ?? 0}</strong> baths
            </span>{' '}
            •{' '}
            <span>
              <strong>
                {property.LM_Int2_3
                  ? property.LM_Int2_3.toLocaleString()
                  : 0}
              </strong>{' '}
              sqft
            </span>
          </div>

          <p className="card-address">
            {property.L_Address || 'Address Unavailable'}
            <br />

            {property.L_City || ''}

            {property.L_City && property.L_State
              ? ', '
              : ''}

            {property.L_State || ''}{' '}
            {property.L_Zip || ''}
          </p>
        </div>
      </div>
    </Link>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired
};

export default PropertyCard;