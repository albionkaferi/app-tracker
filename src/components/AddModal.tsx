import { useState } from "react";
import { Button, Modal, Input} from 'antd';
import TimeInput from "./TimeInput";
import { error, success } from "../helpers";

function AddModal({add_app}: {add_app: (name: String, allowed: number) => Promise<unknown>}) {
    const [open, setOpen] = useState(false);  
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);
    
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
        className="modal-form"
        open={open}
        title="Add Application"
        onCancel={closeModal}
        footer={[]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            style={{ width: '30%' }}
            id="name-input"
            autoComplete="off"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="App name..."
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
      </Modal>
      </>
    );

}

export default AddModal;