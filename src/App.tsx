import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import AppList from "./components/AppList";
import AddModal from "./components/AddModal";
import { AppDataList } from "./types";

function App() {
  const [list, setList] = useState<AppDataList>([]);

  useEffect(() => {
    const initList = async () => {
      const data = await invoke("retrieve_data");
      setList(data as AppDataList);
    };
    initList();

    const initListener = async () => {
      const unlisten = await listen("changed", (event) => {
        setList(event.payload as AppDataList);
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

  return (
    <>
      <AddModal />
      <hr />
      <AppList list={list} />
    </>
  );
}

export default App;
