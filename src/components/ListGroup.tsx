import { useState } from "react";

function ListGroup() {
  let items = ["new york", "san francisco", "chicago", "boston", "los angeles"];
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [name, setName] = useState("");
  const getMessage = () => {
    items.length === 0 && <p>No items found</p>;
  };

  return (
    <>
      <h1>List</h1>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item-active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
        ;
      </ul>
    </>
  );
}

export default ListGroup;
