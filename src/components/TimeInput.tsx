import { useRef } from "react";
import { InputNumber } from "antd";

const min = 0;
const defaultValue = 0;

function TimeInput({ setAllowed }: { setAllowed: (seconds: number) => void }) {
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
      <InputNumber
        addonAfter={"H"}
        controls={false}
        min={min}
        max={23}
        onChange={onHoursChange}
        style={{ width: "72px", margin: "0 1px 0 0.5em", paddingLeft: "0" }}
      />
      <InputNumber
        addonAfter={"M"}
        controls={false}
        min={min}
        max={59}
        onChange={onMinutesChange}
        style={{ width: "75px", margin: "0 1px 0 1px" }}
      />
      <InputNumber
        addonAfter={"S"}
        controls={false}
        min={min}
        max={59}
        onChange={onSecondsChange}
        style={{ width: "70px", margin: "0 0.5em 0 1px" }}
      />
    </>
  );
}

export default TimeInput;
