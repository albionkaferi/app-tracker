import { useState } from "react";
import { Button, Modal, Input, Upload} from 'antd';
import TimeInput from "./TimeInput";
import { error, success } from "../helpers";
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

function AddModal({add_app}: {add_app: (name: string, allowed: number) => Promise<string>}) {
    const [open, setOpen] = useState(false);  
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);

    const preventUpload = (file: RcFile) => {
      setName(`${file.name.slice(0, -4)}`)
      return false;
    }
    
    async function onClickHandler() {
      const result: string = await add_app(name+".exe", allowed);
      if (result.startsWith('Error')) {
        error(result)
      }
      else {
        success(result);
        closeModal();
      }
    }

    const showModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    }

    return (
      <>
      <Button type="primary" onClick={showModal}>
        Add Limit
      </Button>
      <Modal
        className="modal-form"
        open={open}
        title="Add Limit"
        onCancel={closeModal}
        footer={[]}
      >
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: "3px" }}>
          <Input
            style={{width: "32%"}}
            id="app-input"
            autoComplete="off"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="App name..."
            value={name}
            suffix=".exe"
          />
          <TimeInput setAllowed={setAllowed} />
          <Button
            type="default"
            htmlType="submit"
            onClick={onClickHandler}
          >
            Add
          </Button>
        </div>
        <div>
          <Upload
            listType="text"
            accept=".exe"
            maxCount={1}
            beforeUpload={preventUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Choose file</Button>
          </Upload>
        </div>
      </Modal>
      </>
    );

}

export default AddModal;