import { InputNumber } from 'antd';

const min = 0;
const defaultValue = 0;
let times: number[] = [defaultValue, defaultValue, defaultValue]

function TimeInput({setAllowed}: {setAllowed: (seconds: number) => void }) {
  const calculateAndSetAllowed = () => {
    let total = 0;
    total += times[0] * 3600;
    total += times[1] * 60;
    total += times[2];
    setAllowed(total);
  };
  
  
  const onHoursChange = (value: number | null) => {
    times[0] = Number(value);
    calculateAndSetAllowed();
  };
  const onMinutesChange = (value: number | null) => {
    times[1] = Number(value);
    calculateAndSetAllowed();
  };
  const onSecondsChange = (value: number | null) => {
    times[2] = Number(value);
    calculateAndSetAllowed();
  };
  return (
    <>
    <InputNumber min={min} max={23} defaultValue={defaultValue} onChange={onHoursChange} />
    <InputNumber min={min} max={59} defaultValue={defaultValue} onChange={onMinutesChange} />
    <InputNumber min={min} max={59} defaultValue={defaultValue} onChange={onSecondsChange} />
    </>
  );
}

export default TimeInput;