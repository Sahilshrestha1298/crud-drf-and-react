import { useState, useEffect } from "react";

const BASE_URL =
  "https://crud-drf-and-react-production.up.railway.app/api/grocery";
function App() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Load items from Django API on page load
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Could not load grocery list", err);
      }
    };
    fetchItems();
  }, []);

  // ADD item
  const addItem = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, completed: false }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setItems((prev) => [...prev, result.data]);
      setNewName("");
    } catch {
      console.error("Could not add item");
    }
  };

  // TOGGLE completed
  const toggleItem = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/toggle/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === id ? result.data : item)),
      );
    } catch {
      console.error("Could not toggle item");
    }
  };

  // DELETE item
  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      console.error("Could not delete item");
    }
  };

  // EDIT - save updated name
  const updateItem = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/${editId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === editId ? result.data : item)),
      );
      setEditId(null);
      setEditName("");
    } catch {
      console.error("Could not update item");
    }
  };

  return (
    <div
      style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}
    >
      <h1>🛒 Grocery Bud</h1>

      {/* ADD or EDIT form */}
      <form
        onSubmit={editId ? updateItem : addItem}
        style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="e.g. eggs"
          value={editId ? editName : newName}
          onChange={(e) =>
            editId ? setEditName(e.target.value) : setNewName(e.target.value)
          }
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setEditName("");
            }}
            style={{ padding: "8px 16px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* ITEMS LIST */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              marginBottom: "8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: item.completed ? "line-through" : "none",
                color: item.completed ? "#aaa" : "#000",
              }}
            >
              {item.name}
            </span>
            <button
              onClick={() => {
                setEditId(item.id);
                setEditName(item.name);
              }}
              style={{ padding: "4px 10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              style={{ padding: "4px 10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p style={{ color: "#888" }}>No items yet. Add some groceries!</p>
      )}
    </div>
  );
}

export default App;
