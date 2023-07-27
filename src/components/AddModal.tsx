import { useState } from "react";
import { Button, Modal, Input, message } from 'antd';
import TimeInput from "./TimeInput";

function AddModal({add_app}: {add_app: (name: String, allowed: number) => Promise<unknown>}) {
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
    
    async function onClickHandler() {
      const result = String(await add_app(name, allowed));
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
        Add Application
      </Button>
      <Modal
      open={open}
      title="Add Application"
      onCancel={closeModal}
      footer={[]}>
        <Input
          style={{ width: '30%' }}
          id="name-input"
          autoComplete="off"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="App name..."
        />
        <TimeInput setAllowed={setAllowed}/>
        {contextHolder}
        <Button
          type="default" 
          htmlType="submit"
          onClick={onClickHandler}>
            Add
        </Button>
      </Modal>
      </>
    );

}

export default AddModal;