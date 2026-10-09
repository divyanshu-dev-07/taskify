import { useState, useMemo } from "react";
import {
  Plus, Pencil, Trash2, Clock, Flag, ChevronLeft, ChevronRight,
  X, Check, Calendar as CalendarIcon, AlignLeft
} from "lucide-react";
import {
  TASK_API,
  authHeaders,
  isDemoMode,
  normalizePriority,
  todayKey,
  getCurrentUser,
} from "../lib/taskUtils";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["S","M","T","W","T","F","S"];

const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const sameDay = (a, b) => toKey(a) === toKey(b);

const PRIORITY_STYLES = {
  High:   { label: "High",   dot: "#E15A4D", bg: "#FBE9E7", text: "#9A2E23" },
  Medium: { label: "Medium", dot: "#E0A62B", bg: "#FBF1DC", text: "#8A5E0B" },
  Low:    { label: "Low",    dot: "#2F9E8F", bg: "#E1F3EF", text: "#1B5F55" },
};

const emptyForm = (dateKey) => ({
  _id: null,
  text: "",
  description: "",
  dueDate: dateKey,
  dueTime: "09:00",
  priority: "Medium",
  category: "Personal",
});

export default function UpcomingTasks({ tasks = [], setTasks }) {
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toKey(today));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm(toKey(today)));
  const demo = isDemoMode();

  const datedTasks = useMemo(
    () => (tasks || []).filter((t) => t.dueDate),
    [tasks]
  );

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const t of datedTasks) {
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    }
    return map;
  }, [datedTasks]);

  const selectedTasks = useMemo(() => {
    const list = tasksByDate[selectedDate] || [];
    return [...list].sort((a, b) => (a.dueTime || "").localeCompare(b.dueTime || ""));
  }, [tasksByDate, selectedDate]);

  const upcomingCount = useMemo(() => {
    const todayStr = todayKey();
    return datedTasks.filter((t) => t.dueDate >= todayStr && !t.completed).length;
  }, [datedTasks]);

  const gridDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  const changeMonth = (delta) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  const selectDay = (d) => {
    if (!d) return;
    setSelectedDate(toKey(d));
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(emptyForm(selectedDate));
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setForm({
      _id: task._id,
      text: task.text,
      description: task.description || "",
      dueDate: task.dueDate,
      dueTime: task.dueTime || "09:00",
      priority: normalizePriority(task.priority),
      category: task.category || "Personal",
    });
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const saveTask = async () => {
    if (!form.text.trim()) return;
    const payload = {
      text: form.text.trim(),
      description: form.description || "",
      dueDate: form.dueDate,
      dueTime: form.dueTime || "",
      priority: normalizePriority(form.priority),
      category: form.category || "Personal",
    };

    if (demo) {
      if (form._id) {
        setTasks((prev) => prev.map((t) => (t._id === form._id ? { ...t, ...payload } : t)));
      } else {
        setTasks((prev) => [
          ...prev,
          { ...payload, _id: `demo-${Date.now()}`, completed: false },
        ]);
      }
      setSelectedDate(form.dueDate);
      setShowForm(false);
      return;
    }

    try {
      const user = getCurrentUser();
      const isEdit = Boolean(form._id);
      const response = await fetch(isEdit ? `${TASK_API}/${form._id}` : TASK_API, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(
          isEdit ? payload : { ...payload, userId: user?._id, completed: false }
        ),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => {
          if (isEdit) return prev.map((t) => (t._id === form._id ? data.task : t));
          return [...prev, data.task];
        });
        setSelectedDate(form.dueDate);
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    if (demo) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      return;
    }
    try {
      const response = await fetch(`${TASK_API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDone = async (task) => {
    if (demo) {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: !t.completed } : t))
      );
      return;
    }
    try {
      const response = await fetch(`${TASK_API}/${task._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
  const selectedLabel = `${selectedDateObj.getDate()} ${MONTH_NAMES[selectedDateObj.getMonth()]}, ${selectedDateObj.getFullYear()}`;
  const isViewingToday = sameDay(selectedDateObj, today);

  return (
    <div className="w-full max-w-9xl mx-auto bg-[#F4F5F8] dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-[#E3E5EC] dark:border-slate-800">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[320px] shrink-0 bg-[#1E2438] text-white p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[19px] font-semibold tracking-tight">Upcoming</h2>
            <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/80">
              {upcomingCount} active
            </span>
          </div>
          <p className="text-[12.5px] text-white/50 mb-5">Calendar of your real tasks</p>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => changeMonth(-1)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
              aria-label="Previous month"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-[13.5px] font-medium">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
              aria-label="Next month"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 mb-1">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="text-center text-[10.5px] text-white/35 font-medium">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {gridDays.map((d, idx) => {
              if (!d) return <div key={idx} />;
              const key = toKey(d);
              const isSelected = key === selectedDate;
              const isToday = sameDay(d, today);
              const dayTasks = tasksByDate[key];
              const hasTasks = dayTasks && dayTasks.length > 0;
              const hasHighPriority = hasTasks && dayTasks.some((t) => normalizePriority(t.priority) === "High" && !t.completed);

              return (
                <button
                  key={idx}
                  onClick={() => selectDay(d)}
                  className={`relative h-9 rounded-lg text-[12.5px] flex flex-col items-center justify-center transition
                    ${isSelected ? "bg-[#5B6EF5] text-white font-semibold" : "hover:bg-white/10 text-white/85"}
                    ${isToday && !isSelected ? "ring-1 ring-inset ring-[#E0A62B]/70" : ""}
                  `}
                >
                  <span>{d.getDate()}</span>
                  {hasTasks && (
                    <span
                      className="absolute bottom-1 w-1 h-1 rounded-full"
                      style={{ background: isSelected ? "#fff" : hasHighPriority ? "#E15A4D" : "#5B6EF5" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/45">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5B6EF5]" />Has task</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E15A4D]" />High priority</span>
          </div>
        </div>

        <div className="flex-1 p-5 md:p-6 bg-white dark:bg-slate-900">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[18px] font-semibold text-[#1E2438] dark:text-slate-100">
                {isViewingToday ? "Today" : selectedLabel}
              </h3>
              <p className="text-[12.5px] text-[#8A8FA3] mt-0.5">
                {selectedTasks.length} task{selectedTasks.length === 1 ? "" : "s"} on this date
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 bg-[#1E2438] hover:bg-[#2A3150] text-white text-[13px] font-medium px-3.5 py-2 rounded-xl transition"
            >
              <Plus size={15} /> Add task
            </button>
          </div>

          {selectedTasks.length === 0 && !showForm && (
            <div className="border border-dashed border-[#E3E5EC] dark:border-slate-700 rounded-xl py-10 text-center">
              <CalendarIcon size={22} className="mx-auto text-[#C7CADA] mb-2" />
              <p className="text-[13px] text-[#8A8FA3]">No tasks on this date</p>
              <button onClick={openAddForm} className="text-[12.5px] text-[#5B6EF5] font-medium mt-1 hover:underline">
                Add the first task
              </button>
            </div>
          )}

          <div className="space-y-2">
            {selectedTasks.map((t) => {
              const p = PRIORITY_STYLES[normalizePriority(t.priority)];
              return (
                <div
                  key={t._id}
                  className={`group border rounded-xl px-3.5 py-3 transition ${t.completed ? "border-[#E3E5EC] bg-[#FAFAFC] dark:border-slate-800 dark:bg-slate-950" : "border-[#E7E8F0] dark:border-slate-700 hover:border-[#C9CCE0]"}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleDone(t)}
                      aria-label={t.completed ? "Mark active" : "Mark complete"}
                      className={`mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition ${t.completed ? "bg-[#5B6EF5] border-[#5B6EF5]" : "border-[#C9CCE0] hover:border-[#5B6EF5]"}`}
                    >
                      {t.completed && <Check size={11} className="text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-[14px] font-medium ${t.completed ? "line-through text-[#B4B7C6]" : "text-[#1E2438] dark:text-slate-100"}`}>
                          {t.text}
                        </p>
                        <span
                          className="text-[10.5px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: p.bg, color: p.text }}
                        >
                          <Flag size={10} /> {p.label}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-[12.5px] text-[#8A8FA3] mt-1 leading-snug">{t.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-[#9598AA]">
                        {t.dueTime && <span className="flex items-center gap-1"><Clock size={11} /> {t.dueTime}</span>}
                        <span className="flex items-center gap-1"><CalendarIcon size={11} /> {t.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() => openEditForm(t)}
                        className="w-7 h-7 rounded-lg hover:bg-[#EEF0F8] dark:hover:bg-slate-800 flex items-center justify-center text-[#6B6F84]"
                        aria-label="Edit task"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(t._id)}
                        className="w-7 h-7 rounded-lg hover:bg-[#FBEAEA] flex items-center justify-center text-[#B4483D]"
                        aria-label="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showForm && (
            <div className="mt-4 border border-[#E3E5EC] dark:border-slate-700 rounded-xl p-4 bg-[#FAFAFC] dark:bg-slate-950">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-[#1E2438] dark:text-slate-100">
                  {form._id ? "Edit task" : "New task"}
                </h4>
                <button onClick={closeForm} className="w-6 h-6 rounded-md hover:bg-[#EEF0F8] dark:hover:bg-slate-800 flex items-center justify-center text-[#8A8FA3]" aria-label="Close">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 block">Title</label>
                  <input
                    type="text"
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder="Task title"
                    className="w-full text-[13.5px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 flex items-center gap-1"><AlignLeft size={11} /> Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional notes"
                    rows={2}
                    className="w-full text-[13.5px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 block">Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full text-[13px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 block">Time</label>
                    <input
                      type="time"
                      value={form.dueTime}
                      onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
                      className="w-full text-[13px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 block">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full text-[13px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#6B6F84] mb-1 block">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full text-[13px] border border-[#DBDEEA] dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:border-[#5B6EF5] bg-white dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Shopping">Shopping</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={saveTask}
                    className="flex items-center gap-1.5 bg-[#5B6EF5] hover:bg-[#4A5CE0] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition"
                  >
                    <Check size={14} /> {form._id ? "Save" : "Add"}
                  </button>
                  <button
                    onClick={closeForm}
                    className="text-[13px] font-medium px-4 py-2 rounded-lg text-[#6B6F84] hover:bg-[#EEF0F8] dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
