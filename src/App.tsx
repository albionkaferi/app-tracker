import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import AppList from './components/AppList';
import AddModal from './components/AddModal';

function App() {
  const [list, setList] = useState<string[]>([]);


  useEffect(() => {
      invoke("retrieve_data").then((res) => {
        setList(res as string[]);
      });
    }, [add_app, remove_app]);

  async function add_app(name: String, allowed: number) {
    return await invoke("add_app", { name: name, allowed_time: allowed });
  }

  async function remove_app(name: String) {
    return await invoke("remove_app", {name});
  }

  async function edit_app(name: String) {
    console.log("This is temporary", name);
  }

  return (
    <>
      <AddModal add_app={add_app}/>
      <p>{status}</p>
      <hr />
      <AppList list={list} edit_app={edit_app} remove_app={remove_app}/>
    </>
  );
}

export default App;
