import React, { useState, useEffect, useRef } from 'react';
import { fetchProperties } from '../api/client';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import {PropertyFilters} from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import SortControls from '../components/SortControls';

const ITEMS_PER_PAGE = 20;

/**
 * Entire ListingsPage Component
 */
export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilters, setActiveFilters] =
    useState({});

  const [currentPage, setCurrentPage] =
    useState(1);

  /*
   * Sorting state
   */
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const currentRequestId = useRef(0);

  useEffect(() => {
    const requestId =
      ++currentRequestId.current;

    async function loadListings() {
      try {
        setLoading(true);
        setError(null);

        const offset =
          (currentPage - 1) *
          ITEMS_PER_PAGE;

        const cleanFilters =
          Object.entries(activeFilters).reduce(
            (acc, [key, val]) => {
              if (
                val !== '' &&
                val !== null &&
                val !== undefined
              ) {
                acc[key] = val;
              }

              return acc;
            },
            {}
          );

        const queryParams = {
          ...cleanFilters,
          limit: ITEMS_PER_PAGE,
          offset
        };

        if (sortBy) {
          queryParams.sortBy = sortBy;
          queryParams.sortOrder = sortOrder;
        }

        const data =
          await fetchProperties(queryParams);

        if (
          requestId ===
          currentRequestId.current
        ) {
          setProperties(
            data.results || []
          );

          setTotal(
            data.total || 0
          );
        }
      } catch (err) {
        if (
          requestId ===
          currentRequestId.current
        ) {
          setError(
            err.message ||
              'Failed to fetch property listings.'
          );
        }
      } finally {
        if (
          requestId ===
          currentRequestId.current
        ) {
          setLoading(false);
        }
      }
    }

    loadListings();
  }, [
    activeFilters,
    currentPage,
    sortBy,
    sortOrder
  ]);

  /*
   * When new filters are applied, goes back to page 1
   */
  const handleSearch = (newFilters) => {
    setCurrentPage(1);
    setSortBy('');
    setSortOrder('');
    setActiveFilters(newFilters);
  };

  /*
   * Clear filters also resets sorting.
   */
  const handleClear = () => {
    setCurrentPage(1);
    setSortBy('');
    setSortOrder('');
    setActiveFilters({});
  };

  /*
   * Sorting doesn't change the page.
   */
  const handleSortChange = (
    newSortBy,
    newSortOrder
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="listings-container">
      <header className="listings-header">
        <h1>Property Listings</h1>

        {!loading && !error && (
          <p className="listings-count">
            Showing {properties.length} of{' '}
            {total} properties
          </p>
        )}
      </header>

      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={loading}
      />

      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
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

          <button
            onClick={() =>
              setActiveFilters({
                ...activeFilters
              })
            }
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="property-grid">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard
                  key={property.L_ListingID}
                  property={property}
                />
              ))
            ) : (
              <p className="no-results">
                No properties match your filter
                criteria.
              </p>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalCount={total}
            limit={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}