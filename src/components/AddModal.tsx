import { useState, useEffect } from "react";
import { Button, Input, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function AddModal({add_app}: {add_app: (name: String, allowed: number) => Promise<void>}) {
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState(0);

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
        <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          add_app(name, allowed);
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
    );

}

export default AddModal;