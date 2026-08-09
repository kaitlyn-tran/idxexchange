import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageRange } from '../Pagination';

describe('Pagination Utility Logic (getPageRange)', () => {
  test('returns full range when total pages <= 7', () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('handles right ellipsis when near start of page list', () => {
    expect(getPageRange(1, 20)).toEqual([1, 2, 3, 4, 5, '...', 20]);
  });

  test('handles left ellipsis when near end of page list (Fixes Debug Challenge)', () => {
    const range = getPageRange(19, 20);
    expect(range).toEqual([1, '...', 16, 17, 18, 19, 20]);
    expect(range.filter((item) => item === 20).length).toBe(1);
  });

  test('handles double ellipsis when navigating in the middle', () => {
    expect(getPageRange(10, 20)).toEqual([1, '...', 9, 10, 11, '...', 20]);
  });
});

describe('Pagination Component UI', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test('returns null when total pages is 1 or fewer', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalCount={15}
        limit={20}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders correctly on the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        limit={20}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    expect(screen.getByText('Showing')).toBeInTheDocument();
    expect(screen.getByText('1–20')).toBeInTheDocument();
  });

  test('disables Next button on the last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalCount={100}
        limit={20}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  test('triggers onPageChange with correct value on page click', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        limit={20}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('triggers onPageChange with previous and next clicks', () => {
    render(
      <Pagination
        currentPage={3}
        totalCount={100}
        limit={20}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});