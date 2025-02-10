import React, { useState } from "react";

interface DropdownProps {
  title: string;
  options: string[];
  initial?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  initial = -1,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(initial);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClick = (index: number) => {
    setSelected(index);
  };

  const renderOptions = () => {
    return options.map((option, index) => (
      <li
        key={index}
        onClick={() => handleClick(index)}
        className={`dropdown__list-item ${
          index === selected ? "dropdown__list-item--active" : ""
        }`}
      >
        {option}
      </li>
    ));
  };

  return (
    <div className="dropdown">
      <div
        onClick={toggleDropdown}
        className="dropdown__toggle dropdown__list-item"
      >
        {title}
        <i className="fa fa-angle-down" aria-hidden="true"></i>
      </div>
      <ul
        className={`dropdown__list ${isOpen ? "dropdown__list--active" : ""}`}
      >
        {renderOptions()}
      </ul>
    </div>
  );
};

export default Dropdown;
