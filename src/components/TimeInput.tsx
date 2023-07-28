import { useRef } from 'react';
import { InputNumber } from 'antd';

const min = 0;
const defaultValue = 0;

function TimeInput({setAllowed}: {setAllowed: (seconds: number) => void }) {
  const times = useRef([defaultValue, defaultValue, defaultValue]);

  const calculateAndSetAllowed = () => {
    let total = 0;
    total += times.current[0] * 3600;
    total += times.current[1] * 60;
    total += times.current[2];
    setAllowed(total);
  };
  
  const onHoursChange = (value: number | null) => {
    times.current[0] = Number(value);
    calculateAndSetAllowed();
  };
  const onMinutesChange = (value: number | null) => {
    times.current[1] = Number(value);
    calculateAndSetAllowed();
  };
  const onSecondsChange = (value: number | null) => {
    times.current[2] = Number(value);
    calculateAndSetAllowed();
  };
  
  return (
    <>
      <InputNumber placeholder='Hours' min={min} max={23} onChange={onHoursChange} />
      <InputNumber placeholder='Minutes' min={min} max={59} onChange={onMinutesChange} />
      <InputNumber placeholder='Seconds' min={min} max={59} onChange={onSecondsChange} />
    </>
  );
}

export default TimeInput;
