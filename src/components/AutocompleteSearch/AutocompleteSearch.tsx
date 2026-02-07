import React, { useState } from "react";
import './AutocompleteSearch.css'

const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"];

const AutocompleteSearch: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value) {
      setFilteredOptions([]);
      return;
    }

    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    setFilteredOptions([]);
  };

  // Function to highlight matching text
  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search..."
        className="autocomplete-input"
      />
      {filteredOptions.length > 0 && (
        <ul className="autocomplete-list">
          {filteredOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="autocomplete-item"
            >
              {getHighlightedText(option, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;
