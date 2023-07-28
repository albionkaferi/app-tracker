import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Modal, Progress, Space, Table } from 'antd';
import { error, processToObject, strokeColor, success } from "../helpers";
import TimeInput from './TimeInput';
import { secondsToTimeString } from '../helpers';

interface DataType {
  key: string;
  name: string;
  total: string;
  allowed: string;
  progress: number;
}


function AppList({list, edit_app, remove_app}: {list: string[], edit_app: (name: string, allowed: number) => Promise<[string, number]>, remove_app: (name: string) => Promise<string>}) {
    const [open, setOpen] = useState(false);  
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);

    const showModal = (name: string) => {
      setName(name);
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    }

    const handleEdit = async () => {
      const result = await edit_app(name, allowed);
      const resultString: string = result[0];
      const resultNumber: number = result[1];
      const messageToUser: string = `${resultString} [${secondsToTimeString(resultNumber)}]`;
      if (resultString.startsWith("Error")) {
        error(messageToUser);
      } else {
        success(messageToUser);
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
        title: 'Usage',
        dataIndex: 'total',
        align: 'center',
        key: 'total',
        sorter: (a: DataType, b: DataType) => Number(a.total) - Number(b.total),
      },
      {
        title: 'Limit',
        dataIndex: 'allowed',
        align: 'center',
        key: 'allowed',
        sorter: (a: DataType, b: DataType) => Number(a.allowed) - Number(b.allowed),
      },
      {
        title: '% Used',
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
        title="Edit Limit"
        onCancel={closeModal}
        footer={[]}>
          <TimeInput setAllowed={setAllowed}/>
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