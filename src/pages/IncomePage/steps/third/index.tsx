import { Button } from "antd";
import React from "react";

interface IProps {
  prevStep: () => void;
}

export const ThirdStep: React.FC<IProps> = ({ prevStep }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      Third step
      <Button onClick={prevStep}>Back</Button>
    </div>
  );
};
