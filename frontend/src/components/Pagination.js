import React from 'react';
import './Pagination.css';


export const getPageRange = (currentPage, totalPages, siblingCount = 1) => {
  if (totalPages <= 1) return [];

  const totalNumbers = siblingCount * 2 + 5; 

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  return [];
};

const Pagination = ({ currentPage, totalCount, limit, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      <div className="pagination-summary">
        Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
        <strong>{totalCount}</strong> properties
      </div>

      <ul className="pagination-list">
        {/* Previous Button */}
        <li>
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
          >
            &laquo; Prev
          </button>
        </li>

        {/* Page Items & Ellipses */}
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${idx}`} className="pagination-ellipsis">
                &#8230;
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;