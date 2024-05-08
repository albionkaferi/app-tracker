import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import AppList from "./components/AppList";
import AddModal from "./components/AddModal";

function App() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    const initListener = async () => {
      const unlisten = await listen("changed", (event) => {
        setList(event.payload as string[]);
      });
      return unlisten;
    };
    const unlisten = initListener();

    return () => {
      unlisten.then((unlisten) => {
        unlisten();
      });
    };
  }, []);

  async function add_app(name: string, allowed: number): Promise<string> {
    return await invoke("add_app", { name: name, allowed_time: allowed });
  }

  async function remove_app(name: string): Promise<string> {
    return await invoke("remove_app", { name });
  }

  async function edit_app(
    name: string,
    allowed: number
  ): Promise<[string, number]> {
    return await invoke("edit_app", { name: name, allowed_time: allowed });
  }

  return (
    <>
      <AddModal add_app={add_app} />
      <hr />
      <AppList list={list} edit_app={edit_app} remove_app={remove_app} />
    </>
  );
}

export default App;
