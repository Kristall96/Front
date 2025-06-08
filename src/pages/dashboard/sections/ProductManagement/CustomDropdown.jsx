import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  defaultOption = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selected = options.find((opt) => opt._id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option._id } });
    setIsOpen(false);
  };

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1 text-gray-300">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-2.5 pr-10 rounded-md text-sm
        bg-[#2a3142] text-white border relative
        ${error ? "border-red-500" : "border-gray-600"}
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {selected ? selected.name : defaultOption}
        <span className="absolute right-3 top-3 pointer-events-none">
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown list container */}
      <ul
        className={`absolute z-10 mt-1 w-full bg-[#2a3142] text-white border border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden
        transition-all duration-395 origin-top
        ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {options.map((option, i) => (
          <li
            key={option._id}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-600 text-white
  transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  ${
    isOpen
      ? "opacity-100 rotate-0 translate-y-0"
      : "opacity-0 rotate-6 translate-y-6"
  }`}
            style={{
              transitionDelay: isOpen ? `${i * 60}ms` : "0ms",
            }}
          >
            {option.name}
          </li>
        ))}
      </ul>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomDropdown;
