import { useState } from "react";
import { Button, Modal, Input, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function AddModal({add_app}: {add_app: (name: String, allowed: number) => Promise<void>}) {
    const [open, setOpen] = useState(false);  
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);

    const showModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    }

    const getSeconds = (time: Dayjs | null, timeString: string) => {
        if (time === null) return;
        let total = 0;
        const timeArray = timeString.split(':');
        total += Number(timeArray[0]) * 3600;
        total += Number(timeArray[1]) * 60;
        total += Number(timeArray[2]);
        setAllowed(total);
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
      footer={[]}

      >
        <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          add_app(name, allowed);
          closeModal();
          console.log("Form submitted");
        }}
      >
        <Input
          style={{ width: '30%' }}
          id="name-input"
          autoComplete="off"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="App name..."
        />
        <TimePicker
          style={{ width: '22%', margin: '0px 10px 0px 10px'}} 
          id="time-picker"
          onChange={getSeconds}
        />
        <Button
        type="default" 
        htmlType="submit">Add</Button>
      </form>
      </Modal>
      </>
    );

}

export default AddModal;