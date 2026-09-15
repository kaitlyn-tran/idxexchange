import React from 'react';
import PropTypes from 'prop-types';

function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
  isLoading
}) {
  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      onSortChange('', '');
      return;
    }

    const [field, order] = value.split('|');

    onSortChange(field, order);
  };

  const currentSort =
    sortBy && sortOrder
      ? `${sortBy}|${sortOrder}`
      : '';

  return (
    <div className="sort-controls">
      <label htmlFor="sortBy">Sort by</label>

      <select
        id="sortBy"
        value={currentSort}
        onChange={handleSortChange}
        disabled={isLoading}
      >
        <option value="">Default</option>

        <option value="price|asc">
          Price: Low to High
        </option>

        <option value="price|desc">
          Price: High to Low
        </option>

        <option value="date|desc">
          Date Listed: Newest
        </option>

        <option value="date|asc">
          Date Listed: Oldest
        </option>

        <option value="sqft|desc">
          Square Footage: Largest
        </option>

        <option value="sqft|asc">
          Square Footage: Smallest
        </option>

        <option value="beds|desc">
          Beds: Most
        </option>

        <option value="beds|asc">
          Beds: Fewest
        </option>
      </select>
    </div>
  );
}

SortControls.propTypes = {
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default SortControls;