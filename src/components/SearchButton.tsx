import React from "react";

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center w-full bg-blue-500 text-white text-sm font-medium py-2.5 px-2.5 rounded-lg hover:bg-blue-600 transition">
      <span className='ti ti-search'></span>
      <span title='eg.(doctor, nurse e.t.c)'>Find practitioner</span>
    </button>

  );
};

export default SearchButton;
