import { Button } from "antd";
import React from "react";

interface IProps {
  prevStep: () => void;
  nextStep: () => void;
}

export const SecondStep: React.FC<IProps> = ({ prevStep, nextStep }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      Second step
      <Button onClick={prevStep}>Back</Button>
      <Button onClick={nextStep}>Forward</Button>
    </div>
  );
};
