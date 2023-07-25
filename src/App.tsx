import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [allowed, setAllowed] = useState(0);
  const [status, setStatus] = useState("");

  async function add_app() {
    setStatus(await invoke("add_app", { name: name, allowed_time: allowed }));
  }

  async function remove_app() {
    setStatus(await invoke("remove_app", {name}));
  }

  return (
    <>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          add_app();
          console.log("Form submitted");
        }}
      >
        <input
          id="name-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <input
          id="allowed-input"
          onChange={(e) => setAllowed(Number(e.currentTarget.value))}
          placeholder="Enter allowed time..."
        />
        <button type="submit">Add</button>
      </form>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          remove_app();
          console.log("Form submitted");
        }}
      >
        <input
          id="name-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Remove</button>
      </form>
      <p>{status}</p>
    </>
  );
}

export default App;
