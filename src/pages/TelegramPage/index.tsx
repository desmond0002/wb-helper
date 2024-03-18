import { Button, Segmented, notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFile } from "../../features/file/fileSelector";

export const TelegramPage: React.FC = () => {
  const [value, setValue] = useState<string>("Benovy");
  const [text, setText] = useState<string>("");
  const fileData = useSelector(getFile);

  const calcHandler = useCallback(
    (Brand: string) => {
      let result = "";
      const today = new Date();
      let sum = 0;

      if (fileData.length > 0) {
        result += `${Brand}\n\n${today.getDate()} ${today.toLocaleString(
          "default",
          { month: "long" }
        )} ${today.getFullYear()} г.\n\n`;
        for (let index = 0; index < fileData.length; index++) {
          const element = fileData[index];
          if (
            element["Заказано"] &&
            element["Цена"] &&
            element.brand == Brand
          ) {
            if (element)
              result += `${element.color} ${element.size.toLowerCase()} ${
                element["Заказано"]
              } - ${element["Цена"]}\n`;
            sum += Number(element["Заказано"]);
          }
        }
        result += `\n\nИтого ${sum / 10} коробок.`;
      }
      setText(result);
    },
    [fileData]
  );

  useEffect(() => {
    calcHandler(value);
  }, [value, calcHandler]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      {" "}
      {fileData.length > 0 ? (
        <>
          <Segmented
            options={["Benovy", "Nitrimax"]}
            value={value}
            onChange={setValue}
          />

          {text.split("\n").map((line) => (
            <>
              {line}
              <br />
            </>
          ))}

          <Button
            onClick={() => {
              navigator.clipboard.writeText(text);
              notification.success({
                placement: "topRight",
                duration: 2,
                message: "Скопировано в буфер!",
              });
            }}
          >
            Копировать
          </Button>
        </>
      ) : (
        "No data"
      )}
    </div>
  );
};
