import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import "./App.css";
import { ListItem, Divider, List, ListItemText, Checkbox, ListItemIcon, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Input, TimePicker, Progress } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


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

  async function edit_app(name: String) {
    console.log("This is temporary", name);
  }

  dayjs.extend(customParseFormat);

  const getSeconds = (time: Dayjs | null, timeString: string) => {
    if (time === null) return;
    let total = 0;
    const timeArray = timeString.split(':');
    total += Number(timeArray[0]) * 3600;
    total += Number(timeArray[1]) * 60;
    total += Number(timeArray[2]);
    setAllowed(total);
  };

  const strokeColor = (percent: number) => {
    switch (true) {
      case percent <= 10:
        return { from: '#e24768', to: '#d7415e' };
      case percent <= 20:
        return { from: '#d7415e', to: '#cc3b54' };
      case percent <= 30:
        return { from: '#cc3b54', to: '#c0354a' };
      case percent <= 40:
        return { from: '#c0354a', to: '#b53041' };
      case percent <= 50:
        return { from: '#b53041', to: '#aa2a38' };
      case percent <= 60:
        return { from: '#aa2a38', to: '#9f252f' };
      case percent <= 70:
        return { from: '#9f252f', to: '#942027' };
      case percent <= 80:
        return { from: '#942027', to: '#891b1f' };
      case percent <= 90:
        return { from: '#891b1f', to: '#7e1518' };
      default:
        return { from: '#7e1518', to: '#731010' };
    }
  };

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
        <Input 
          style={{ width: '30%' }}
          id="name-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <TimePicker
          style={{ width: '15%', margin: '0px 10px 0px 10px'}} 
          id="time-picker"
          onChange={getSeconds}
        />
        <Button type="default" htmlType="submit">Add</Button>
      </form>
      <p>{status}</p>
      <hr />
      <List sx={{ width: '100%' }}>
        {list.map((process) => {
          const name = process[0];
          const past = process[1][0];
          const curr = process[1][1];
          const allowed = process[1][2];
          const total = (past + curr < allowed) ? past + curr : allowed;
          const percent = Math.trunc(Number(total) / Number(allowed) * 100);
          return (
            <React.Fragment key={process}>
              <ListItem
              style={{ paddingBottom: "0"}}
              >
                <ListItemText primary={`${name}`} />
                <ListItemText primary={`Today: ${total}/${allowed}`} />
                <IconButton type="submit" onClick={() => edit_app(name)}><ModeEditIcon fontSize="small"/></IconButton>
                <IconButton type="submit" onClick={() => remove_app(name)}><DeleteIcon fontSize="small"/></IconButton>
              </ListItem>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Progress 
                  style={{ width: "85%", margin: "auto", paddingBottom: "8px"}}
                  percent={percent} status="active" 
                  strokeColor={strokeColor(percent)} 
                />
              </div>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
}

export default App;
