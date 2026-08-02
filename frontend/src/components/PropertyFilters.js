import React, {useState} from 'react';

const initialFilterState = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: ''
};

export function PropertyFilters({ onSearch, onClear, isLoading }) {
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