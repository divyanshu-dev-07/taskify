import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./component/Header";
import Sidebar from "./component/Sidbar";
import TodoList from "./component/TodoList";
import Inbox from "./component/Inbox";
import Upcomingtasks from "./component/Upcomingtasks";
import {
  isDemoMode,
  loadDemoTasks,
  saveDemoTasks,
  clearDemoSession,
  demoTimeLeftMs,
  getCurrentUser,
} from "./lib/taskUtils";
import { useTheme } from "./context/ThemeContext";


function App() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(() => getCurrentUser());

  const [activeView, setActiveView] = useState(() => {
    return (
      localStorage.getItem("activeView") ||
      localStorage.getItem("taskify-default-view") ||
      "All Tasks"
    );
  });

  const [tasks, setTasks] = useState(() =>
    isDemoMode() ? loadDemoTasks() : []
  );
  const [loadingTasks, setLoadingTasks] = useState(
    () => !isDemoMode()
  );

  // Keep sidebar state suitable for the current screen.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const handleScreenChange = (event) => {
      setSidebarOpen(event.matches);
    };

    media.addEventListener("change", handleScreenChange);

    return () => {
      media.removeEventListener("change", handleScreenChange);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      if (isDemoMode()) return;

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!currentUser || !token) return;

      setLoadingTasks(true);

      const response = await fetch(
        "https://taskify-backend-el3h.onrender.com/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const demo = isDemoMode();

    if (!user || (!token && !demo)) {
      clearDemoSession();
      setTasks([]);
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!isDemoMode()) return;

    const expire = () => {
      clearDemoSession();
      setTasks([]);
      setUser(null);
      navigate("/", { replace: true });
    };

    const timer = setTimeout(expire, demoTimeLeftMs());

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    if (isDemoMode()) {
      saveDemoTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (isDemoMode()) {
      setLoadingTasks(false);
      return;
    }

    if (user && localStorage.getItem("token")) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoadingTasks(false);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  const viewHeadings = {
    "All Tasks": "My Tasks",
    Today: "Today",
    Important: "Important",
    Completed: "Completed",
    Inbox: "Inbox",
    Upcoming: "Upcoming",
    Work: "Work",
    Personal: "Personal",
    Shopping: "Shopping",
  };

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user?.name || "there";
  const demo = isDemoMode();

  return (
    <div className="min-h-screen pt-16 bg-[#F4F7FB] dark:bg-slate-950 flex flex-col">
      <Header
        user={user}
        setUser={setUser}
        setTasks={setTasks}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tasks={tasks}
        theme={theme}
        setTheme={setTheme}
        setActiveView={setActiveView}
      />

      <div className="relative flex flex-1 min-w-0">
        <Sidebar
          tasks={tasks}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <div
          className="flex-1 min-w-0 px-4 md:px-10 h-[calc(100dvh-64px)] overflow-y-auto">

          <main className="w-full max-w-6xl mx-auto p-3 md:p-6">
            {demo && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                Guest demo — you can try adding tasks and exploring
                tools, but nothing is saved permanently. Sign in to
                keep your work.
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div className="min-w-0">
                <h1 className="text-slate-800 dark:text-slate-100 text-2xl md:text-3xl font-extrabold mb-1 break-words">
                  {greeting}, {displayName} 👋
                </h1>

                <p className="text-slate-400 text-sm">
                  Focus on {viewHeadings[activeView] || activeView}.
                  Great things take consistent effort.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView("Today")}
                className="sm:text-right bg-transparent border-0 cursor-pointer"
              >
                <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
                  {dateLabel}
                </p>
                <p className="text-slate-400 text-xs">
                  Make it a productive day!
                </p>
              </button>
            </div>

            {loadingTasks ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-16 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-400">
                  Loading your tasks...
                </p>
              </div>
            ) : activeView === "Inbox" ? (
              <Inbox
                tasks={tasks}
                setTasks={setTasks}
                fetchTasks={fetchTasks}
              />
            ) : activeView === "Upcoming" ? (
              <div className="mt-2">
                <Upcomingtasks tasks={tasks} setTasks={setTasks} />
              </div>
            ) : (
              <TodoList
                tasks={tasks}
                allTasks={tasks}
                setTasks={setTasks}
                activeView={activeView}
                searchTerm={searchTerm}
                fetchTasks={fetchTasks}
                setActiveView={setActiveView}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


export default App;
