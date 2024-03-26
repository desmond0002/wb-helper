import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/lauout";
import { MainPage } from "../../pages/MainPage";
import { AboutPage } from "../../pages/AboutPage";
import { TelegramPage } from "../../pages/TelegramPage";
import { IncomePage } from "../../pages/IncomePage";
import { SalesPage } from "../../pages/SalesPage";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/telegram" element={<TelegramPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export { Router };
