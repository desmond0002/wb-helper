import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <>
      <span>Изи поставки by desmond0002</span>
      <br />
      <br />
      <span>Добавить функционал:</span>
      <br />
      <br />

      <ul>
        <li>Построение таблицы разбиения по складам - buildTable.js</li>
        <li>Загрузка тз по гугл апи - load-multi-tz.js</li>
        <li>Создание тз в виде эксель файла - tz-multi.js</li>
        <li>Создание тз в виде эксель файла - tz-single.js</li>
      </ul>
    </>
  );
};
