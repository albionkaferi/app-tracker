import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import type { ColumnsType } from "antd/es/table";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Button, Modal, Progress, Space, Table } from "antd";
import {
  error,
  processToObject,
  strokeColor,
  success,
  secondsToTimeString,
} from "../helpers";
import TimeInput from "./TimeInput";
import { AppDataList, ColumnType } from "../types";

function AppList({ list }: { list: AppDataList }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [allowed, setAllowed] = useState(0);

  const handleEdit = async () => {
    const result: [string, number] = await invoke("edit_app", {
      name: name,
      allowedTime: allowed,
    });
    const resultString: string = result[0];
    const resultNumber: number = result[1];
    const messageToUser: string = `${resultString} [${secondsToTimeString(
      resultNumber,
    )}]`;
    if (resultString.startsWith("Error")) {
      error(messageToUser);
    } else {
      success(messageToUser);
      setOpen(false);
    }
  };

  const handleDelete = async (name: string) => {
    await invoke("remove_app", { name: name });
  };

  const columns: ColumnsType<ColumnType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
      sorter: (a: ColumnType, b: ColumnType) => a.name.localeCompare(b.name),
    },
    {
      title: "Usage",
      dataIndex: "total",
      align: "center",
      key: "total",
      sorter: (a: ColumnType, b: ColumnType) =>
        Number(a.total) - Number(b.total),
    },
    {
      title: "Limit",
      dataIndex: "allowed",
      align: "center",
      key: "allowed",
      sorter: (a: ColumnType, b: ColumnType) =>
        Number(a.allowed) - Number(b.allowed),
    },
    {
      title: "% Used",
      dataIndex: "progress",
      align: "center",
      key: "progress",
      sorter: (a: ColumnType, b: ColumnType) =>
        Number(a.progress) - Number(b.progress),
      render: (progress: number) => (
        <Progress
          type="circle"
          size={40}
          style={{
            width: "85%",
            margin: "auto",
            paddingBottom: "0",
            paddingTop: "0",
          }}
          percent={progress}
          status="active"
          strokeColor={strokeColor(progress)}
        />
      ),
    },
    {
      title: "Actions",
      align: "center",
      key: "action",
      render: (_, record: ColumnType) => (
        <Space size="middle">
          <IconButton
            type="submit"
            onClick={() => {
              setName(record.name);
              setOpen(true);
            }}
          >
            <ModeEditIcon fontSize="small" />
          </IconButton>
          <IconButton type="submit" onClick={() => handleDelete(record.name)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={processToObject(list)}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={open}
        title="Edit Limit"
        onCancel={() => setOpen(false)}
        width={375}
        footer={[]}
      >
        <TimeInput setAllowed={setAllowed} />
        <Button type="default" htmlType="submit" onClick={handleEdit}>
          Submit
        </Button>
      </Modal>
    </>
  );
}

export default AppList;
