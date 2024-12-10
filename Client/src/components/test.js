import "./test.css";

//import React, { useState } from "react";

// function Dropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const items = ["Apple", "Banana", "Cherry", "Date", "Grape"];

//   const filteredItems = items.filter((item) =>
//     item.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="dropdown-container">
//       <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <span className="arrow">{isOpen ? "▲" : "▼"}</span>
//       </div>
//       {isOpen && (
//         <ul className="dropdown-list">
//           {filteredItems.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Dropdown;
import React, { useState } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const items = ["Apple", "Banana", "Cherry", "Date", "Grape"];

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item); // Optionally, set the searchTerm to the selected item.
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          placeholder="Search..."
          value={selectedItem || searchTerm} // Show selected item or the search term
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {filteredItems.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
