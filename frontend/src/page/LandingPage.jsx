import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  Sun,
  Moon,
  ArrowRight,
  CalendarDays,
  Bell,
  BarChart3,
  CircleCheck,
  Search,
  Plus,
  Shield,
  Layers,
  Sparkles,
  Users,
  Target,
  Clock,
  Flag,
} from "lucide-react";
import { startGuestSession } from "../lib/taskUtils";
import { useTheme } from "../context/ThemeContext";


const navLinks = [
  ["Home", "#home"],
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["About", "#about"],
  // ["Contact", "#Contact"],
];

const benefits = ["Free to use", "Simple & fast", "Built for productivity"];

const sideItems = [
  [CircleCheck, "Tasks"],
  [CalendarDays, "Calendar"],
  [Bell, "Reminders"],
  [BarChart3, "Progress"],
];

const stats = [
  ["Total Tasks", "12", "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"],
  ["In Progress", "5", "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"],
  ["Completed", "7", "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"],
];

const previewTasks = [
  ["Finish React project", "Work", "10:00 AM", "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"],
  ["Go to gym", "Personal", "1:00 PM", "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"],
  ["Learn Node.js", "Study", "4:00 PM", "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"],
  ["Read a book", "Habit", "8:00 PM", "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"],
];

const features = [
  [CircleCheck, "Easy Task Management", "Add, edit, duplicate and organize tasks in seconds with priorities and categories.", "bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-300"],
  [CalendarDays, "Calendar View", "Plan your days, jump between dates, and keep every deadline in one place.", "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300"],
  [Bell, "Smart Reminders", "See due-today alerts so important work never slips out of view.", "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300"],
  [BarChart3, "Track Progress", "Watch completion stats update as you finish work and build momentum.", "bg-violet-50 text-violet-500 dark:bg-violet-950/40 dark:text-violet-300"],
  [Layers, "Workspaces & Lists", "Inbox, Today, Upcoming, Work, Personal and Shopping — switch views instantly.", "bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-300"],
  [Shield, "Secure Task Storage", "Your tasks are securely stored and available whenever you sign in.", "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"],
  [Flag, "Priority Management", "Set High, Medium, or Low priority levels to focus on what matters most.", "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"],
];

const steps = [
  ["Add your tasks", "Capture titles, due dates, categories and priority in one quick form."],
  ["Organize & prioritize", "Filter by High / Medium / Low and jump between lists that match how you work."],
  ["Complete & Track Progress", "Mark tasks as complete, monitor progress, and stay on top of your goals."],
];

// import { CircleCheck, Flag, Shield } from "lucide-react";

const aboutStats = [
  [
    CircleCheck,
    "Task Management",
    "Create, organize, and manage tasks efficiently.",
  ],
  [
    Flag,
    "Priority Tracking",
    "Focus on important work with priority levels.",
  ],
  [
    Shield,
    "Secure Storage",
    "Your tasks are safely stored and accessible anytime.",
  ],
];

const team = [
  ["Alex Rivera", "Product", "Designs the daily workflow so planning feels effortless."],
  ["Jordan Blake", "Engineering", "Builds the dashboard, calendar, and sync you can trust."],
  ["Sam Chen", "Support", "Helps people stay focused when their lists get busy."],
];

const highlights = [
  [
    CircleCheck,
    "Task Management",
    "Create, organize and manage tasks efficiently.",
  ],
  [
    Flag,
    "Priority Tracking",
    "Focus on important work with priority levels.",
  ],
  [
    Shield,
    "Secure Storage",
    "Your tasks are safely stored and accessible anytime.",
  ],
];

// const team = [
//   ["Alex Rivera", "Product", "Designs the daily workflow so planning feels effortless."],
//   ["Jordan Blake", "Engineering", "Builds the dashboard, calendar, and sync you can trust."],
//   ["Sam Chen", "Support", "Helps people stay focused when their lists get busy."],
// ];

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestError, setGuestError] = useState("");
const [activeSection, setActiveSection] = useState("Home");


  const startGuestDemo = (e) => {
    e.preventDefault();
    const name = guestName.trim();
    if (name.length < 2) {
      setGuestError("Enter your name to continue as guest");
      return;
    }

    startGuestSession(name);
    navigate("/app");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F8FF] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important } }
      `}</style>

      <header className="relative z-20">
        <nav className="mx-auto flex items-center justify-between px-6 py-2 lg:px-10 fixed w-full bg-[#f7f8ff] dark:bg-[#0b1020]">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition group-hover:rotate-6 group-hover:scale-110">
              <Check size={22} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Todo<span className="text-indigo-600">Flow</span>
            </span>
          </button>

          <div className="hidden items-center gap-9 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setActiveSection(label)}
                className={`relative transition
        after:absolute
        after:-bottom-1.5
        after:left-0
        after:h-0.5
        after:rounded-full
        after:bg-indigo-600
        after:transition-all
        hover:text-indigo-600
        ${activeSection === label
                    ? "text-indigo-600 after:w-full"
                    : "after:w-0 hover:after:w-full"
                  }
      `}
              >
                {label}
              </a>
            ))}
          </div>

          {/* <div className="hidden items-center gap-9 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            {navLinks.map(([label, href], i) => (
              <a
                key={href}
                href={href}
                className={`relative transition after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-indigo-600 after:transition-all hover:text-indigo-600 ${i === 0
                  ? "text-indigo-600 after:w-full"
                  : "after:w-0 hover:after:w-full"
                  }`}
              >
                {label}
              </a>
            ))}
          </div> */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="hidden rounded-xl p-2.5 text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800 sm:block"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hidden rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:block"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-600/40"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10 lg:pb-32 lg:pt-16">
          <div className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-indigo-200/50 blur-[110px] dark:bg-indigo-900/40" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-pink-100/60 blur-[110px] dark:bg-violet-900/30" />

          <div className="relative grid items-center gap-16 lg:grid-cols-2">
            <div className="max-w-2xl animate-[fadeUp_.8s_ease-out_both]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                {/* <span>✦</span> */}
                A smarter way to stay productive
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                Plan Today.
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 bg-clip-text text-transparent">
                  Build Tomorrow.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400">
                Taskify helps you manage tasks, track priorities, and stay productive with a clean and simple workspace.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setGuestError("");
                    setShowGuestForm(true);
                  }}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-indigo-600/30 transition hover:-translate-y-1 hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-600/40"
                >
                  Try Demo
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  Login / Sign Up
                </button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check size={10} strokeWidth={4} />
                    </span>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-[fadeUp_.8s_ease-out_.2s_both]">
              <div className="transition duration-500 hover:-translate-y-1 hover:scale-[1.01]">
                <div className="rounded-2xl border-[6px] border-slate-800 bg-white shadow-2xl shadow-indigo-500/20 dark:bg-slate-900">
                  <div className="flex min-h-[380px] overflow-hidden rounded-lg">
                    <div className="hidden w-36 border-r border-slate-100 p-4 dark:border-slate-800 sm:block">
                      <div className="mb-7 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                          <Check size={14} />
                        </div>
                        <span className="text-xs font-bold">TodoFlow</span>
                      </div>

                      <div className="space-y-1.5 text-[10px] font-medium">
                        {sideItems.map(([Icon, label], i) => (
                          <div
                            key={label}
                            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 transition ${i === 0
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60"
                              : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600 dark:hover:bg-slate-800"
                              }`}
                          >
                            <Icon size={13} />
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex items-center justify-between">
                        <div className="relative w-36">
                          <Search
                            size={12}
                            className="absolute left-2.5 top-2.5 text-slate-400"
                          />
                          <div className="rounded-lg bg-slate-50 py-2 pl-7 text-[9px] text-slate-400 dark:bg-slate-800">
                            Search tasks...
                          </div>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-violet-100 text-center text-xs font-semibold leading-7 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                          D
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-[10px] text-slate-400">
                          Monday, September 20
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          Welcome 👋
                        </h3>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {stats.map(([label, value, color]) => (
                          <div
                            key={label}
                            className={`rounded-lg p-3 transition hover:-translate-y-1 hover:shadow-md ${color}`}
                          >
                            <p className="text-[9px] text-slate-500 dark:text-slate-400">{label}</p>
                            <p className="mt-1 text-xl font-bold">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-xs font-semibold">Today's Tasks</h4>
                          <button type="button" className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-indigo-500">
                            <Plus size={11} />
                            Add Task
                          </button>
                        </div>

                        <div className="space-y-2">
                          {previewTasks.map(([task, category, time, chip]) => (
                            <div
                              key={task}
                              className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-sm transition hover:translate-x-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                              <div className="h-3.5 w-3.5 rounded-full border border-slate-300 transition group-hover:border-indigo-500 group-hover:bg-indigo-100" />
                              <span className="flex-1 text-[9px] text-slate-700 dark:text-slate-300">
                                {task}
                              </span>
                              <span className={`rounded-full px-2 py-0.5 text-[8px] font-medium ${chip}`}>
                                {category}
                              </span>
                              <span className="hidden text-[8px] text-slate-400 sm:block">
                                {time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-3xl bg-gradient-to-b from-slate-300 to-slate-400 shadow-lg" />
              </div>

              <div className="absolute -bottom-10 -right-4 hidden w-32 animate-[float_6s_ease-in-out_infinite] rounded-[22px] border-[5px] border-slate-800 bg-white p-3 shadow-2xl shadow-indigo-900/30 dark:bg-slate-900 sm:block">
                <p className="mb-2 flex items-center gap-1 text-[9px] font-bold">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-indigo-600 text-white">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  TodoFlow
                </p>
                <div className="space-y-1.5">
                  {previewTasks.map(([task]) => (
                    <div
                      key={task}
                      className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1.5 text-[7px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="h-2 w-2 rounded-full border border-slate-300" />
                      {task}
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 rounded-md bg-indigo-600 py-1.5 text-center text-[8bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indipx] font-semibold text-white">
                  + Add Task
                </div>
              </div>

              <div className="absolute -left-6 bottom-6 hidden -rotate-6 sm:block">
                {/* <div className="animate-[float_5s_ease-in-out_infinite_.5s] rounded-md bg-amber-100 px-4 py-3 text-xs font-semibold leading-5 text-slate-700 shadow-xl transition hover:scale-110 dark:bg-amber-300/90">
                  Plan
                  <br />
                  Focus
                  <br />
                  Achieve
                  <br />
                  Repeat
                </div> */}
              </div>

              <div className="absolute -right-3 -top-6 hidden rotate-3 text-sm font-semibold text-violet-500 sm:block">
                Organize
                <br />
                {/* Your Life ✦ */}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative">
          <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
            <div className="mb-10 max-w-2xl">
              <p className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-lg font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                Features
              </p>
              <h2 className="mt-4 text-3xl font-bold dark:text-white sm:text-4xl">
                Everything you need to stay on track.
              </h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Organize tasks, manage deadlines, track progress, and stay productive with everything you need in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([Icon, title, desc, color]) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 hover:ring-indigo-200 dark:bg-slate-900 dark:ring-slate-800"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 group-hover:rotate-6 ${color}`}
                  >
                    <Icon size={23} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="mx-auto max-w-5xl px-6 pb-24 pt-8 text-center">
            <p className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-lg font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              From thought to done.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
              Capture tasks, organize priorities, and stay productive with a simple workflow.
            </p>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map(([title, desc], i) => (
                <div
                  key={title}
                  className="group rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 hover:ring-indigo-200 dark:bg-slate-900 dark:ring-slate-800"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30 transition group-hover:scale-110">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <Clock className="text-indigo-500" size={20} />
                <h3 className="mt-3 text-sm font-semibold">Today & Upcoming</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">See what is due now and what is coming next week.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <Sparkles className="text-indigo-500" size={20} />
                <h3 className="mt-3 text-sm font-semibold">Guest Demo</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try every tool without an account. Explore all features instantly. Demo data is cleared automatically.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <Target className="text-indigo-500" size={20} />
                <h3 className="mt-3 text-sm font-semibold">Sign in to save</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create an account to securely save, sync, and access your tasks anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-slate-200/70 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <p className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-lg font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              About
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
              Taskify helps you organize work, stay focused, and get things done.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Taskify is a modern task management application designed to help you organize daily work, track progress, and stay productive. Create tasks, set priorities, manage deadlines, and keep everything in one place.
            </p>
            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Whether you're managing personal goals, work projects, or daily routines, Taskify provides a simple and distraction-free workspace to help you stay on track.
            </p>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {aboutStats.map(([Icon, title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
                >
                  <Icon className="w-8 h-8 text-indigo-600 mb-4" />

                  <p className="text-3xl font-extrabold text-indigo-600">
                    {title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* <section id="Contact" className="border-t border-slate-200/70 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <p className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-lg font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              Contact
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
              Taskify helps you organize work, stay focused, and get things done.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Taskify is a modern task management application designed to help you organize daily work, track progress, and stay productive. Create tasks, set priorities, manage deadlines, and keep everything in one place.
            </p>
            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Whether you're managing personal goals, work projects, or daily routines, Taskify provides a simple and distraction-free workspace to help you stay on track.
            </p>
              <div className="mt-14 grid gap-6 md:grid-cols-3">
            {highlights.map(([Icon, title, description]) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
              >
                <Icon className="w-8 h-8 text-indigo-600 mb-4" />

                <p className="text-3xl font-extrabold text-indigo-600">
                  {title}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
            </div>

          </div>
        </section> */}

        <footer className="border-t border-slate-200/70 bg-white/50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row lg:px-10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
                <Check size={16} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">TodoFlow</span>
            </div>
            <p>Built to help you get things done.</p>
          </div>
        </footer>
      </main>

      {showGuestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={startGuestDemo}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900"
          >
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Try the demo</h2>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
              This is only for trying the product. Your tasks will <strong>not</strong> be saved permanently. When you leave the site — or after a short time — demo tasks are removed. Sign in if you want to keep your work.
            </div>
            <label htmlFor="guestName" className="mt-6 mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Your name
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setGuestError("");
              }}
              placeholder="e.g. Divyam"
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {guestError && <p className="mt-2 text-xs text-rose-500">{guestError}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200"
              >
                Sign in instead
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white"
              >
                Start demo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
