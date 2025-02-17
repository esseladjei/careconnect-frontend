import React from "react";
interface SearchButtonProps {
  lable?: string;
  title?: string;
  onClick: () => void
}
const SearchButton = ({ onClick, lable, title = 'eg.(doctor, nurse e.t.c)' }: SearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center w-full bg-blue-500 text-white text-sm font-medium py-2.5 px-2.5 rounded-lg hover:bg-blue-600 transition">
      <span className='ti ti-search'></span>
      <span title={title}>{lable}</span>
    </button>

  );
};

export default SearchButton;
