import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Modal, Progress, Space, Table, message } from 'antd';
import { processToObject, strokeColor } from "../helpers";
import TimeInput from './TimeInput';

interface DataType {
  key: string;
  name: string;
  total: string;
  allowed: string;
  progress: number;
}


function AppList({list, edit_app, remove_app}: {list: string[], edit_app: (name: String, allowed: number) => Promise<unknown>, remove_app: (name: String) => Promise<unknown>}) {
    const [open, setOpen] = useState(false);  
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    const success = (result: string) => {
      messageApi.open({
        type: 'success',
        content: result,
        duration: 3
      });
    };
    const error = (result: string) => {
      messageApi.open({
        type: 'error',
        content: result,
        duration: 3
      });
    };

    const showModal = (name: string) => {
      setName(name);
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    }

    const handleEdit = async () => {
      const result: string = String(await edit_app(name, allowed));
      if (result.startsWith("Error")) {
        error(result);
      } else {
        success(result);
        closeModal();
      }
    }


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
            <IconButton type="submit" onClick={() => showModal(record.name)}><ModeEditIcon fontSize="small"/></IconButton>
            <IconButton type="submit" onClick={() => remove_app(record.name)}><DeleteIcon fontSize="small"/></IconButton>
          </Space>
        ),
      },
    ];


    return (
      <>
        <Table columns={columns} dataSource={processToObject(list)} pagination={{ pageSize: 5}}/>

        <Modal
        open={open}
        title="Add Application"
        onCancel={closeModal}
        footer={[]}>
          <TimeInput setAllowed={setAllowed}/>
          {contextHolder}
          <Button
            type="default" 
            htmlType="submit"
            onClick={handleEdit}>
              Submit
          </Button>
      </Modal>
    </>
    );
}

export default AppList;