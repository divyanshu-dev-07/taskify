import {
  CheckCircle2,
  Circle,
  CalendarDays,
  Star,
  Inbox,
  Clock3,
  Plus,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

const DemoDashboard = () => {
  const demoTasks = [
    {
      id: 1,
      title: "Finish React project",
      category: "Work",
      time: "10:00 AM",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Go to gym",
      category: "Personal",
      time: "1:00 PM",
      priority: "Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Learn Node.js",
      category: "Study",
      time: "4:00 PM",
      priority: "High",
      completed: false,
    },
    {
      id: 4,
      title: "Read a book",
      category: "Personal",
      time: "8:00 PM",
      priority: "Low",
      completed: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800">

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <CheckCircle2 size={22} />
            </div>

            <span className="text-lg font-bold">
              Todo<span className="text-indigo-600">Flow</span>
            </span>

            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              Demo
            </span>
          </div>

          {/* Demo notice */}
          <div className="hidden text-sm text-slate-400 md:block">
            You are viewing the demo version
          </div>

          {/* Exit */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Exit Demo
          </button>

        </div>
      </header>


      {/* Main */}
      <div className="flex pt-16">

        {/* Sidebar */}
        <aside className="fixed bottom-0 left-0 top-16 hidden w-64 border-r border-slate-200 bg-white md:block">

          <div className="p-5">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">

              <button
                className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-600"
              >
                <LayoutDashboard size={18} />
                All Tasks
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50"
              >
                <Clock3 size={18} />
                Today
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50"
              >
                <Star size={18} />
                Important
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50"
              >
                <Inbox size={18} />
                Inbox
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-50"
              >
                <CalendarDays size={18} />
                Upcoming
              </button>

            </nav>

          </div>

        </aside>


        {/* Content */}
        <main className="w-full px-6 py-8 md:ml-64 md:px-10">

          <div className="mx-auto max-w-6xl">

            {/* Demo Banner */}
            <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="font-semibold text-indigo-900">
                    You're exploring TodoFlow Demo
                  </p>

                  <p className="mt-1 text-sm text-indigo-600">
                    This is sample data. Create an account to manage your own tasks.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Create Account
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>


            {/* Heading */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="mb-1 text-sm text-slate-400">
                  Monday, September 20
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                  Good morning 👋
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Here's what you have planned for today.
                </p>
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                <Plus size={18} />
                Add Task
              </button>

            </div>


            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-400">
                  Total Tasks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-800">
                  12
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tasks in your workspace
                </p>
              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-400">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  5
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tasks waiting for you
                </p>
              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-500">
                  7
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Great progress!
                </p>
              </div>

            </div>


            {/* Tasks */}
            <div className="rounded-2xl border border-slate-200 bg-white">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>
                  <h2 className="font-bold text-slate-800">
                    Today's Tasks
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Your demo tasks for today
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {demoTasks.length} tasks
                </span>

              </div>


              <div className="divide-y divide-slate-100">

                {demoTasks.map((task) => (

                  <div
                    key={task.id}
                    className="flex items-center gap-4 px-6 py-5 transition hover:bg-slate-50"
                  >

                    {/* Checkbox */}
                    {task.completed ? (
                      <CheckCircle2
                        size={22}
                        className="shrink-0 text-emerald-500"
                      />
                    ) : (
                      <Circle
                        size={22}
                        className="shrink-0 text-slate-300"
                      />
                    )}


                    {/* Task */}
                    <div className="min-w-0 flex-1">

                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {task.time}
                      </p>

                    </div>


                    {/* Category */}
                    <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 sm:block">
                      {task.category}
                    </span>


                    {/* Priority */}
                    <span
                      className={`hidden rounded-full px-3 py-1 text-xs font-medium md:block ${
                        task.priority === "High"
                          ? "bg-rose-50 text-rose-500"
                          : task.priority === "Medium"
                          ? "bg-amber-50 text-amber-500"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {task.priority}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* Bottom message */}
            <div className="mt-8 rounded-2xl bg-slate-900 px-6 py-7 text-white">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="text-lg font-semibold">
                    Ready to manage your own tasks?
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Create your free account and start organizing your day.
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Get Started
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default DemoDashboard;