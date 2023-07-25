import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import "./App.css";
import { ListItem, Divider, List, ListItemText, Checkbox, ListItemIcon } from '@mui/material';

function App() {
  const [name, setName] = useState("");
  const [allowed, setAllowed] = useState(0);
  const [status, setStatus] = useState("");
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
      invoke("retrieve_data").then((res) => {
        setList(res as string[]);
      });
    }, [add_app, remove_app]);

  async function add_app() {
    setStatus(await invoke("add_app", { name: name, allowed_time: allowed }));
  }

  async function remove_app(name: String) {
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
      <p>{status}</p>

      <List sx={{ width: '100%' }}>
        {list.map((process) => {
          const name = process[0];
          const past = process[1][0];
          const curr = process[1][1];
          const allowed = process[1][2];
          return (
            <React.Fragment key={process}>
              <ListItem>
                <ListItemIcon>
                  <Checkbox/>
                </ListItemIcon>
                <ListItemText primary={`${name}`} />
                <ListItemText primary={`Today: ${past + curr}/${allowed}`} />
                <button type="submit" onClick={() => remove_app(name)}>Remove</button>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
}

export default App;
