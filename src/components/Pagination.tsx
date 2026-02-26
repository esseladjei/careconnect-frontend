import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Smooth scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      pages.push(1);

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-16 mb-12 flex justify-center items-center gap-3">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold
          hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed 
          disabled:hover:bg-white transition-all duration-200 flex items-center gap-2"
        aria-label="Previous page"
      >
        <span>←</span> Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
        {pageNumbers.map((page, index) =>
          typeof page === 'string' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-gray-500 font-medium"
            >
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-md font-semibold transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white border border-transparent hover:border-gray-300'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold
          hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed 
          disabled:hover:bg-white transition-all duration-200 flex items-center gap-2"
        aria-label="Next page"
      >
        Next <span>→</span>
      </button>

      {/* Page Info */}
      <div className="text-sm font-medium text-gray-600 ml-4 hidden sm:block">
        Page <span className="font-bold text-gray-900">{currentPage}</span> of{' '}
        <span className="font-bold text-gray-900">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
