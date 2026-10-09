import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Download,
  LogOut,
  Moon,
  Settings,
  Sun,
  Trash2,
  UserRound,
  Check,
  Bell,
  CheckCheck,
  MessageCircle,
  UserPlus,
  Clock3,
  CircleCheck,
} from "lucide-react";

import {
  TASK_API,
  authHeaders,
  isDemoMode,
  clearDemoSession,
} from "../lib/taskUtils";

function Header({
  user,
  setUser,
  setTasks,
  searchTerm,
  setSearchTerm,
  tasks = [],
  theme,
  setTheme,
  setActiveView,
}) {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("taskify-notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const menuRef = useRef(null);

  const isDemo = isDemoMode();

  /*
  |--------------------------------------------------------------------------
  | Save notifications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    localStorage.setItem(
      "taskify-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  /*
  |--------------------------------------------------------------------------
  | Close menus when clicking outside
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const closeMenus = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Notification helper
  |--------------------------------------------------------------------------
  */

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const exists = prev.some(
        (item) => item.id === notification.id
      );

      if (exists) return prev;

      return [notification, ...prev].slice(0, 50);
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Create reminder notifications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!Array.isArray(tasks)) return;

    const notificationsEnabled =
      localStorage.getItem("taskify-notify") !== "false";

    if (!notificationsEnabled) return;

    const now = new Date();

    tasks.forEach((task) => {
      /*
       * Task should contain:
       *
       * reminderAt: "2026-09-29T20:00:00"
       *
       * If reminderAt doesn't exist, nothing happens.
       */

      if (!task.reminderAt || task.completed) return;

      const reminderTime = new Date(task.reminderAt);

      if (Number.isNaN(reminderTime.getTime())) return;

      const difference =
        reminderTime.getTime() - now.getTime();

      /*
       * Show notification when reminder time
       * is within the next 5 minutes / already due.
       */

      if (difference <= 5 * 60 * 1000 && difference >= -60 * 60 * 1000) {
        addNotification({
          id: `reminder-${task._id}-${task.reminderAt}`,
          type: "reminder",
          title: "Task reminder",
          message: task.text,
          taskId: task._id,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
    });
  }, [tasks]);

  /*
  |--------------------------------------------------------------------------
  | Browser notification
  |--------------------------------------------------------------------------
  */

  const showBrowserNotification = (title, message) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Request browser notification permission
  |--------------------------------------------------------------------------
  */

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Unread count
  |--------------------------------------------------------------------------
  */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Mark notification as read
  |--------------------------------------------------------------------------
  */

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Mark all notifications as read
  |--------------------------------------------------------------------------
  */

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Clear notifications
  |--------------------------------------------------------------------------
  */

  const clearNotifications = () => {
    setNotifications([]);
  };

  /*
  |--------------------------------------------------------------------------
  | Notification icon
  |--------------------------------------------------------------------------
  */

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder":
        return <Clock3 size={18} />;

      case "completed":
        return <CircleCheck size={18} />;

      case "comment":
        return <MessageCircle size={18} />;

      case "assigned":
        return <UserPlus size={18} />;

      default:
        return <Bell size={18} />;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Notification click
  |--------------------------------------------------------------------------
  */

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.taskId) {
      setShowNotifications(false);

      if (setActiveView) {
        setActiveView("All Tasks");
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    clearDemoSession();

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setTasks([]);
    setUser(null);

    setShowProfile(false);

    navigate("/");
  };

  /*
  |--------------------------------------------------------------------------
  | Export tasks
  |--------------------------------------------------------------------------
  */

  const exportTasks = () => {
    const blob = new Blob(
      [JSON.stringify(tasks, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "taskify-tasks.json";

    a.click();

    URL.revokeObjectURL(url);

    setShowProfile(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Clear completed tasks
  |--------------------------------------------------------------------------
  */

  const clearCompleted = async () => {
    const completed = (tasks || []).filter(
      (task) => task.completed
    );

    if (completed.length === 0) {
      alert("No completed tasks to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${completed.length} completed task(s)?`
    );

    if (!confirmed) return;

    if (isDemo) {
      setTasks((prev) =>
        prev.filter((task) => !task.completed)
      );

      setShowProfile(false);

      return;
    }

    try {
      await Promise.all(
        completed.map((task) =>
          fetch(`${TASK_API}/${task._id}`, {
            method: "DELETE",
            headers: authHeaders(),
          })
        )
      );

      setTasks((prev) =>
        prev.filter((task) => !task.completed)
      );

      setShowProfile(false);
    } catch (error) {
      console.error(
        "Failed to delete completed tasks:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open settings
  |--------------------------------------------------------------------------
  */

  const openSettings = () => {
    setShowProfile(false);
    setShowSettings(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle theme
  |--------------------------------------------------------------------------
  */

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className="
          h-16
          bg-white dark:bg-slate-900
          fixed
          top-0
          left-0
          right-0
          z-50
          flex
          items-center
          justify-between
          px-6
          border-b
          border-slate-100
          dark:border-slate-800
        "
      >
        {/* -------------------------------------------------------------
            LOGO
        ------------------------------------------------------------- */}

        <button
          type="button"
          onClick={() => {
            if (setActiveView) {
              setActiveView("All Tasks");
            }
          }}
          className="
            flex
            items-center
            gap-3
            min-w-fit
          "
        >
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >
            T
          </div>

          <div className="hidden sm:block text-left">
            <h1
              className="
                text-sm
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Taskify
            </h1>

            <p
              className="
                text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              Get more done
            </p>
          </div>
        </button>

        {/* -------------------------------------------------------------
            SEARCH
        ------------------------------------------------------------- */}

        <div
          className="
            flex-1
            max-w-xl
            mx-8
            hidden
            md:block
          "
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search tasks..."
              className="
                w-full
                h-10
                px-4
                rounded-xl
                bg-slate-50
                dark:bg-slate-800
                border
                border-slate-200
                dark:border-slate-700
                text-sm
                text-slate-800
                dark:text-white
                placeholder:text-slate-400
                outline-none
                focus:ring-2
                focus:ring-blue-500/20
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT SIDE
        ------------------------------------------------------------- */}

        <div
          className="
            flex
            items-center
            gap-2
          "
          ref={menuRef}
        >
          {/* Theme */}

          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition
            "
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* -----------------------------------------------------------
              NOTIFICATIONS
          ----------------------------------------------------------- */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(
                  !showNotifications
                );

                setShowProfile(false);
              }}
              title="Notifications"
              className="
                relative
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-slate-600
                dark:text-slate-300
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition
              "
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    top-1
                    right-1
                    min-w-[17px]
                    h-[17px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                    dark:border-slate-900
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* Notification panel */}

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-[360px]
                  max-w-[calc(100vw-32px)]
                  bg-white
                  dark:bg-slate-900
                  border
                  border-slate-200
                  dark:border-slate-700
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-[100]
                "
              >
                {/* Header */}

                <div
                  className="
                    px-4
                    py-3
                    border-b
                    border-slate-100
                    dark:border-slate-800
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <h3
                      className="
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Notifications
                    </h3>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Task reminders and activity
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="
                        flex
                        items-center
                        gap-1
                        text-xs
                        text-blue-600
                        hover:text-blue-700
                      "
                    >
                      <CheckCheck size={15} />

                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications */}

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div
                      className="
                        px-6
                        py-10
                        text-center
                      "
                    >
                      <div
                        className="
                          w-12
                          h-12
                          rounded-full
                          bg-slate-100
                          dark:bg-slate-800
                          mx-auto
                          mb-3
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Bell
                          size={22}
                          className="
                            text-slate-400
                          "
                        />
                      </div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-slate-700
                          dark:text-slate-200
                        "
                      >
                        You're all caught up
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-400
                          mt-1
                        "
                      >
                        New reminders and activity
                        will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className={`
                            w-full
                            text-left
                            px-4
                            py-3
                            flex
                            gap-3
                            border-b
                            border-slate-100
                            dark:border-slate-800
                            hover:bg-slate-50
                            dark:hover:bg-slate-800/70
                            transition
                            ${
                              !notification.read
                                ? "bg-blue-50/50 dark:bg-blue-950/20"
                                : ""
                            }
                          `}
                        >
                          <div
                            className="
                              w-9
                              h-9
                              rounded-xl
                              bg-blue-100
                              dark:bg-blue-900/30
                              text-blue-600
                              dark:text-blue-400
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                          >
                            {getNotificationIcon(
                              notification.type
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className="
                                  text-sm
                                  font-medium
                                  text-slate-800
                                  dark:text-white
                                "
                              >
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span
                                  className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-blue-500
                                    mt-1.5
                                    shrink-0
                                  "
                                />
                              )}
                            </div>

                            <p
                              className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                                mt-1
                                line-clamp-2
                              "
                            >
                              {notification.message}
                            </p>
                          </div>
                        </button>
                      )
                    )
                  )}
                </div>

                {/* Footer */}

                {notifications.length > 0 && (
                  <div
                    className="
                      px-4
                      py-3
                      border-t
                      border-slate-100
                      dark:border-slate-800
                    "
                  >
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        text-slate-500
                        hover:text-red-500
                        transition
                      "
                    >
                      <Trash2 size={14} />

                      Clear notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* -----------------------------------------------------------
              PROFILE
          ----------------------------------------------------------- */}

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  h-10
                  px-2
                  rounded-xl
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  transition
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                  "
                >
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <span
                  className="
                    hidden
                    sm:block
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                    max-w-[100px]
                    truncate
                  "
                >
                  {user?.name || "User"}
                </span>
              </button>

              {showProfile && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    w-64
                    bg-white
                    dark:bg-slate-900
                    border
                    border-slate-200
                    dark:border-slate-700
                    rounded-2xl
                    shadow-2xl
                    p-2
                    z-[100]
                  "
                >
                  {/* User info */}

                  <div
                    className="
                      px-3
                      py-3
                      border-b
                      border-slate-100
                      dark:border-slate-800
                      mb-1
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {user?.name || "User"}
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                        truncate
                      "
                    >
                      {user?.email || ""}
                    </p>
                  </div>

                  {/* My tasks */}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("All Tasks");
                      setShowProfile(false);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                    "
                  >
                    <Check size={17} />

                    My Tasks
                  </button>

                  {/* Settings */}

                  <button
                    type="button"
                    onClick={openSettings}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                    "
                  >
                    <Settings size={17} />

                    Settings
                  </button>

                  {/* Theme */}

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                    "
                  >
                    {theme === "dark" ? (
                      <Sun size={17} />
                    ) : (
                      <Moon size={17} />
                    )}

                    {theme === "dark"
                      ? "Light theme"
                      : "Dark theme"}
                  </button>

                  {/* Export */}

                  <button
                    type="button"
                    onClick={exportTasks}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                    "
                  >
                    <Download size={17} />

                    Export tasks
                  </button>

                  {/* Clear completed */}

                  <button
                    type="button"
                    onClick={clearCompleted}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                    "
                  >
                    <Trash2 size={17} />

                    Clear completed
                  </button>

                  {/* Logout */}

                  <div
                    className="
                      border-t
                      border-slate-100
                      dark:border-slate-800
                      mt-1
                      pt-1
                    "
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-sm
                        text-red-600
                        hover:bg-red-50
                        dark:hover:bg-red-950/30
                      "
                    >
                      <LogOut size={17} />

                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                h-10
                px-4
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                text-sm
                font-medium
                transition
              "
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* ---------------------------------------------------------------
          SETTINGS MODAL
      --------------------------------------------------------------- */}

      {showSettings && (
        <SettingsModal
          user={user}
          setUser={setUser}
          theme={theme}
          setTheme={setTheme}
          onClose={() => setShowSettings(false)}
          requestNotificationPermission={
            requestNotificationPermission
          }
        />
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| SETTINGS MODAL
|--------------------------------------------------------------------------
*/

function SettingsModal({
  user,
  setUser,
  theme,
  setTheme,
  onClose,
  requestNotificationPermission,
}) {
  const [name, setName] = useState(
    user?.name || ""
  );

  const [notify, setNotify] = useState(
    localStorage.getItem("taskify-notify") !== "false"
  );

  const [compact, setCompact] = useState(
    localStorage.getItem("taskify-compact") === "true"
  );

  const [defaultView, setDefaultView] = useState(
    localStorage.getItem("taskify-default-view") ||
      "All Tasks"
  );

  const save = () => {
    const nextUser = {
      ...user,
      name: name.trim() || user?.name,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(nextUser)
    );

    localStorage.setItem(
      "taskify-notify",
      notify ? "true" : "false"
    );

    localStorage.setItem(
      "taskify-compact",
      compact ? "true" : "false"
    );

    localStorage.setItem(
      "taskify-default-view",
      defaultView
    );

    localStorage.setItem(
      "activeView",
      defaultView
    );

    setUser(nextUser);

    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          bg-white
          dark:bg-slate-900
          rounded-2xl
          shadow-2xl
          border
          border-slate-200
          dark:border-slate-700
          overflow-hidden
        "
      >
        {/* Header */}

        <div
          className="
            px-6
            py-4
            border-b
            border-slate-100
            dark:border-slate-800
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Settings
            </h2>

            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
                mt-1
              "
            >
              Manage your Taskify preferences
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              text-slate-400
              hover:text-slate-700
              dark:hover:text-white
              text-xl
            "
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">
          {/* Name */}

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
                mb-2
              "
            >
              Your name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-700
                bg-slate-50
                dark:bg-slate-800
                text-sm
                text-slate-900
                dark:text-white
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* Notifications */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-800
                  dark:text-white
                "
              >
                Task notifications
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                "
              >
                Receive reminders and task activity
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const next = !notify;

                setNotify(next);

                if (next) {
                  await requestNotificationPermission();
                }
              }}
              className={`
                w-11
                h-6
                rounded-full
                p-1
                transition
                ${
                  notify
                    ? "bg-blue-600"
                    : "bg-slate-300 dark:bg-slate-700"
                }
              `}
            >
              <span
                className={`
                  block
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  transition
                  ${
                    notify
                      ? "translate-x-5"
                      : "translate-x-0"
                  }
                `}
              />
            </button>
          </div>

          {/* Compact mode */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-800
                  dark:text-white
                "
              >
                Compact mode
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                "
              >
                Show more tasks with less spacing
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setCompact(!compact)
              }
              className={`
                w-11
                h-6
                rounded-full
                p-1
                transition
                ${
                  compact
                    ? "bg-blue-600"
                    : "bg-slate-300 dark:bg-slate-700"
                }
              `}
            >
              <span
                className={`
                  block
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  transition
                  ${
                    compact
                      ? "translate-x-5"
                      : "translate-x-0"
                  }
                `}
              />
            </button>
          </div>

          {/* Theme */}

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
                mb-2
              "
            >
              Theme
            </label>

            <select
              value={theme}
              onChange={(e) =>
                setTheme(e.target.value)
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-700
                bg-slate-50
                dark:bg-slate-800
                text-sm
                text-slate-900
                dark:text-white
                outline-none
              "
            >
              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </div>

          {/* Default view */}

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
                mb-2
              "
            >
              Default view
            </label>

            <select
              value={defaultView}
              onChange={(e) =>
                setDefaultView(e.target.value)
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-700
                bg-slate-50
                dark:bg-slate-800
                text-sm
                text-slate-900
                dark:text-white
                outline-none
              "
            >
              <option value="All Tasks">
                My Tasks
              </option>

              <option value="Today">
                Today
              </option>

              <option value="Important">
                Important
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Upcoming">
                Upcoming
              </option>
            </select>
          </div>
        </div>

        {/* Footer */}

        <div
          className="
            px-6
            py-4
            border-t
            border-slate-100
            dark:border-slate-800
            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              h-10
              rounded-xl
              text-sm
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            className="
              px-5
              h-10
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              font-medium
            "
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;