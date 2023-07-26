import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Input, TimePicker, Progress, Space, Table } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { ColumnsType } from 'antd/es/table';


function App() {
  const [name, setName] = useState("");
  const [allowed, setAllowed] = useState(0);
  const [status, setStatus] = useState("");
  const [list, setList] = useState<string[]>([]);

  interface DataType {
    key: string;
    name: string;
    total: string;
    allowed: string;
    progress: number;
  }

  useEffect(() => {
      invoke("retrieve_data").then((res) => {
        setList(res as string[]);
      });
    }, [add_app, remove_app]);

  function processToObject(list: string[]) {
    return list.map((process) => {
      const total = (process[1][0] + process[1][1] < process[1][2]) ? process[1][0] + process[1][1] :  process[1][2];
      const allowed = process[1][2];
      return {
        key: process[0],
        name: process[0],
        total: total,
        allowed: allowed,
        progress: Math.trunc(Number(total) / Number(allowed) * 100),
      }
    })
  }

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

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
      sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name)
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
      key: 'total',
      sorter: (a: DataType, b: DataType) => Number(a.total) - Number(b.total),
    },
    {
      title: 'Allowed',
      dataIndex: 'allowed',
      align: 'center',
      key: 'allowed',
      sorter: (a: DataType, b: DataType) => Number(a.allowed) - Number(b.allowed),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',      
      align: 'center',
      key: 'progress',
      sorter: (a: DataType, b: DataType) => Number(a.progress) - Number(b.progress),
      render: (progress: number) => (
        <Progress
          type="circle"
          size={40}
          style={{ width: "85%", margin: "auto", paddingBottom: "0", paddingTop: "0"}}
          percent={progress} status="active" 
          strokeColor={strokeColor(progress)} 
        />
      ),
    },
    {
      title: 'Actions',
      align: 'center',
      key: 'action',
      render: (_, record: DataType) => (
        <Space size="middle">
          <IconButton type="submit" onClick={() => edit_app(record.name)}><ModeEditIcon fontSize="small"/></IconButton>
          <IconButton type="submit" onClick={() => remove_app(record.name)}><DeleteIcon fontSize="small"/></IconButton>
        </Space>
      ),
    },
  ];

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
        <Button
        type="default" 
        htmlType="submit">Add</Button>
      </form>
      <p style={{ textAlign: "center" }}>{status}</p>
      <hr />

      <Table columns={columns} dataSource={processToObject(list)} pagination={{ pageSize: 5}}/>

    </>
  );
}

export default App;
