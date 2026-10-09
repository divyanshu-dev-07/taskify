import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

if (localStorage.getItem("taskify-theme") === "dark") {
  document.documentElement.classList.add("dark");
}

import App from "./App.jsx";
import LandingPage from "./page/LandingPage.jsx";
import Login from "./page/Login.jsx";
import Signup from "./page/Signup.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import AppShell from "./component/AppShell.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/app" element={<App />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
