import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import AppList from "./components/AppList";
import AddModal from "./components/AddModal";
import { AppDataList } from "./types";

function App() {
  const [list, setList] = useState<AppDataList>([]);

  useEffect(() => {
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
