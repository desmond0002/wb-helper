// import { Col, InputNumber, Row, Slider } from "antd";

// type InputType = {
//   inputValue: number;
//   setInputValue: (value: number) => void;
// };

// export const DecimalStep: React.FC<InputType> = ({
//   inputValue = 0,
//   setInputValue,
// }) => {
//   const onChange = (value: number) => {
//     if (isNaN(value)) {
//       return;
//     }
//     setInputValue(value);
//   };

//   return (
//     <Row>
//       <Col span={12}>
//         <Slider
//           min={0}
//           max={1}
//           onChange={onChange}
//           value={typeof inputValue === "number" ? inputValue : 0}
//           step={0.01}
//         />
//       </Col>
//       <Col span={4}>
//         <InputNumber
//           min={0}
//           max={1}
//           style={{ margin: "0 16px" }}
//           step={0.01}
//           value={inputValue}
//           onChange={onChange}
//         />
//       </Col>
//     </Row>
//   );
// };
