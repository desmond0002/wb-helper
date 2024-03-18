import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/lauout";
import { MainPage } from "../../pages/MainPage";
import { AboutPage } from "../../pages/AboutPage";
import { TelegramPage } from "../../pages/TelegramPage";
import { IncomePage } from "../../pages/IncomePage";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/telegram" element={<TelegramPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export { Router };
