import {
  FaListUl,
  FaRegCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaInbox,
  FaClock,
} from "react-icons/fa";
import { BsLayoutSidebar } from "react-icons/bs";

function Sidebar({ tasks, isOpen, onToggle, activeView, setActiveView }) {
  const today = new Date().toISOString().split("T")[0];

  const todayCount = tasks.filter(
    (task) => task.date === today && !task.completed
  ).length;

  const allTasksCount = tasks.length;

  const importantCount = tasks.filter(
    (task) => task.priority?.toLowerCase() === "high"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const inboxCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const menuItems = [
    {
      icon: <FaRegCalendarAlt />,
      label: "Today",
      count: todayCount,
    },
    {
      icon: <FaListUl />,
      label: "All Tasks",
      count: allTasksCount,
    },
    {
      icon: <FaStar />,
      label: "Important",
      count: importantCount,
    },
    {
      icon: <FaCheckCircle />,
      label: "Completed",
      count: completedCount,
    },
  ];

  const categories = [
    { color: "bg-blue-500", label: "Work" },
    { color: "bg-green-500", label: "Personal" },
    { color: "bg-yellow-500", label: "Shopping" },
  ];


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <div
        className={`relative shrink-0 transition-[width] duration-300 ease-in-out
    hidden md:block
    ${isOpen ? "md:w-64" : "md:w-0"}
  `}
      ></div>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-16 left-0 z-50
        h-[calc(100dvh-64px)]
        w-64 shrink-0
        bg-white dark:bg-slate-900
        text-slate-700 dark:text-slate-200
        flex flex-col px-3 py-4
        border-r border-slate-100 dark:border-slate-800
        overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Toggle */}
        <div className="flex items-center justify-end px-2 py-1 mb-2">
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            className="text-slate-400 hover:text-slate-700
            transition-colors p-1 rounded-md
            hover:bg-slate-100 cursor-pointer"
          >
            <BsLayoutSidebar size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-1 mb-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveView(item.label);
                if (window.innerWidth < 768) onToggle();
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors
              ${activeView === item.label
                  ? "bg-[#E8F1FF] text-[#3B82F6] font-semibold"
                  : "hover:bg-slate-50 text-slate-600"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">
                  {item.label === "All Tasks" ? "My Tasks" : item.label}
                </span>
              </div>

              {item.count > 0 && (
                <span className="bg-[#E8F1FF] text-[#3B82F6] text-xs px-2 py-0.5 rounded-full font-semibold">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Inbox */}
        <div className="mb-1">
          <div
            onClick={() => {
              setActiveView("Inbox");
              if (window.innerWidth < 768) onToggle();
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors
            ${activeView === "Inbox"
                ? "bg-[#E8F1FF] text-[#3B82F6] font-semibold"
                : "hover:bg-slate-50 text-slate-600"
              }`}
          >
            <div className="flex items-center gap-3">
              <FaInbox className="text-lg" />
              <span className="text-sm font-medium">Inbox</span>
            </div>

            {inboxCount > 0 && (
              <span className="bg-[#E8F1FF] text-[#3B82F6] text-xs px-2 py-0.5 rounded-full font-semibold">
                {inboxCount}
              </span>
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mb-4">
          <div
            onClick={() => {
              setActiveView("Upcoming");
              if (window.innerWidth < 768) onToggle();
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
            ${activeView === "Upcoming"
                ? "bg-[#E8F1FF] text-[#3B82F6] font-semibold"
                : "hover:bg-slate-50 text-slate-600"
              }`}
          >
            <FaClock className="text-lg" />
            <span className="text-sm font-medium">Upcoming</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Categories
            </span>
          </div>

          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveView(cat.label);
                if (window.innerWidth < 768) onToggle();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
              ${activeView === cat.label
                  ? "bg-[#E8F1FF] text-[#3B82F6] font-semibold"
                  : "hover:bg-slate-50 text-slate-600"
                }`}
            >
              <span className={`w-3 h-3 rounded-full ${cat.color}`} />
              <span className="text-sm">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Card */}
        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveView("Today");
              if (window.innerWidth < 768) onToggle();
            }}
            className="text-left bg-[#E8F1FF] rounded-2xl p-4 cursor-pointer border-0"
          >
            <p className="text-slate-800 font-bold text-sm leading-snug">
              Small steps
              <br />
              big progress.
            </p>
            <p className="text-slate-400 text-xs mt-1">Keep going!</p>
          </button>
        </div>
      </aside>

      {/* Reopen button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          className="fixed top-20 left-2 z-[60]
          text-slate-400 hover:text-slate-700
          p-2 rounded-md bg-white dark:bg-slate-900
          shadow-sm cursor-pointer"
        >
          <BsLayoutSidebar size={18} />
        </button>
      )}
    </>
  );

}

export default Sidebar;