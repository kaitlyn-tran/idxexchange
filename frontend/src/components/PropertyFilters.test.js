import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {PropertyFilters} from './PropertyFilters';

describe('PropertyFilters Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter inputs', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} isLoading={false} />);

    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Baths/i)).toBeInTheDocument();
  });

  test('submits filter values', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/City/i), {target: {value: 'Portland'}});
    fireEvent.change(screen.getByLabelText(/Beds/i), {target: {value: '3'}});
    
    fireEvent.click(screen.getByRole('button', {name: /Search/i}));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      city: 'Portland',
      zipcode: '',
      minPrice: '',
      maxPrice: '',
      beds: '3',
      baths: ''
    });
  });

  test('resets fields and calls onClear', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} isLoading={false} />);

    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, {target: {value: 'Seattle'}});
    expect(cityInput.value).toBe('Seattle');

    fireEvent.click(screen.getByRole('button', {name: /Clear Filters/i}));

    expect(cityInput.value).toBe('');
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});