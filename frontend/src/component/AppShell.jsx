import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

const messages = {
  "/": "Loading TodoFlow...",
  "/login": "Opening sign in...",
  "/signup": "Opening sign up...",
  "/app": "Preparing your dashboard...",
};

export default function AppShell({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 720);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <PageLoader message={messages[location.pathname] || "Loading..."} />}
      {children}
    </>
  );
}
