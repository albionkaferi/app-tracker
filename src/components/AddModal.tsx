import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { Button, Modal, Input, Upload } from "antd";
import TimeInput from "./TimeInput";
import { error, success } from "../helpers";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";

function AddModal({}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [allowedTime, setAllowedTime] = useState(0);

  const preventUpload = (file: RcFile) => {
    setName(`${file.name.slice(0, -4)}`);
    return false;
  };

  async function handleSubmit() {
    const result: string = await invoke("add_app", {
      name: name + ".exe",
      allowedTime: allowedTime,
    });
    if (result.startsWith("Error")) {
      error(result);
    } else {
      success(result);
      setOpen(false);
    }
  }

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Limit
      </Button>
      <Modal
        className="modal-form"
        open={open}
        title="Add Limit"
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "3px",
          }}
        >
          <Input
            style={{ width: "32%" }}
            id="app-input"
            autoComplete="off"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="App name..."
            value={name}
            suffix=".exe"
          />
          <TimeInput setAllowed={setAllowedTime} />
          <Button type="default" htmlType="submit" onClick={handleSubmit}>
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
