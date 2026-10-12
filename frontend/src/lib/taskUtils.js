export const TASK_API = "https://taskify-backend-el3h.onrender.com/api/tasks";

export const DEMO_TTL_MS = 30 * 60 * 1000;

export const isDemoMode = () =>
  sessionStorage.getItem("demoMode") === "true" && !localStorage.getItem("token");

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function normalizePriority(value) {
  if (!value) return "Medium";
  const key = String(value).trim().toLowerCase();
  if (key === "high") return "High";
  if (key === "low") return "Low";
  if (key === "medium") return "Medium";
  return "Medium";
}

export function todayKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getCurrentUser() {
  try {
    if (isDemoMode()) {
      return JSON.parse(sessionStorage.getItem("demoUser"));
    }
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  localStorage.removeItem("demoMode");
  localStorage.removeItem("demoTasks");
  sessionStorage.removeItem("demoMode");
  sessionStorage.removeItem("demoUser");
  sessionStorage.removeItem("demoTasks");
  sessionStorage.removeItem("demoStartedAt");
}

export function startGuestSession(name) {
  clearDemoSession();
  localStorage.removeItem("token");
  sessionStorage.setItem("demoMode", "true");
  sessionStorage.setItem(
    "demoUser",
    JSON.stringify({
      _id: `guest-${Date.now()}`,
      name,
      email: "guest@todoflow.demo",
    })
  );
  localStorage.setItem("activeView", "All Tasks");
  sessionStorage.setItem("demoTasks", "[]");
  sessionStorage.setItem("demoStartedAt", String(Date.now()));
}

export function loadDemoTasks() {
  const startedAt = Number(sessionStorage.getItem("demoStartedAt") || 0);
  if (startedAt && Date.now() - startedAt > DEMO_TTL_MS) {
    clearDemoSession();
    return [];
  }

  try {
    const saved = sessionStorage.getItem("demoTasks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveDemoTasks(tasks) {
  sessionStorage.setItem("demoTasks", JSON.stringify(tasks));
}

export function demoTimeLeftMs() {
  const startedAt = Number(sessionStorage.getItem("demoStartedAt") || Date.now());
  return Math.max(0, DEMO_TTL_MS - (Date.now() - startedAt));
}
