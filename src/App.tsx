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

      <List sx={{ width: '100%', maxWidth: 360 }}>
        {list.map((value) => (
          console.log(value),
          <React.Fragment key={value}>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': `checkbox-list-label-${value}` }}
                />
              </ListItemIcon>
              <ListItemText primary={`${value[0]}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
}

export default App;
