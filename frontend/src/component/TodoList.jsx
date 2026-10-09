import { useState, useRef, useEffect } from "react";
import { FaTrash, FaPlus, FaPencilAlt, FaRegCalendarAlt, FaFlag, FaEllipsisH, FaCopy, FaBell } from "react-icons/fa";
import {
  TASK_API,
  authHeaders,
  isDemoMode,
  normalizePriority,
  todayKey,
  getCurrentUser,
} from "../lib/taskUtils";

function TaskMenu({ onEdit, onDelete, onDuplicate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
      >
        <FaEllipsisH />
      </button>

      {open && (
        <div className="absolute right-0 top-7 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <FaPencilAlt className="text-slate-400" /> Edit
          </button>
          <button
            onClick={() => { onDuplicate(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <FaCopy className="text-slate-400" /> Duplicate
          </button>
          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <FaTrash className="text-red-400" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

function EditModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task.text);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(normalizePriority(task.priority));
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [category, setCategory] = useState(task.category || "Personal");

  const priorityIcons = {
    High: <FaFlag className="text-red-400" />,
    Medium: <FaFlag className="text-yellow-400" />,
    Low: <FaFlag className="text-green-400" />,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 w-[500px] rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task title..."
          className="bg-transparent text-slate-800 dark:text-slate-100 text-xl font-semibold focus:outline-none border-b border-slate-200 dark:border-slate-700 pb-2 placeholder:text-slate-400"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
          rows={3}
          className="bg-transparent text-slate-600 dark:text-slate-300 text-sm focus:outline-none resize-none placeholder:text-slate-400"
        />
        <div className="flex items-center gap-3 flex-wrap border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <FaRegCalendarAlt className="text-blue-500 text-sm" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-300 text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {priorityIcons[priority]}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-transparent text-slate-600 dark:text-slate-300 text-sm focus:outline-none cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <FaBell className="text-amber-400 text-sm" />
            <span className="text-slate-600 dark:text-slate-300 text-sm">Reminder</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer border-0 bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ text, description, priority, dueDate, category })}
            className="px-5 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium transition-colors cursor-pointer border-0"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}

function TodoList({ searchTerm, tasks, allTasks, setTasks, activeView }) {
  const sourceTasks = allTasks || tasks || [];
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [newCategory, setNewCategory] = useState("Personal");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [listTab, setListTab] = useState("all");
  const demo = isDemoMode();

  useEffect(() => {
    if (activeView === "Completed") setListTab("completed");
    else if (activeView === "Today" || activeView === "Important") setListTab("active");
    else setListTab("all");
    setPriorityFilter("All");
  }, [activeView]);

  const today = todayKey();

  const filteredBySearchAndPriority = sourceTasks.filter((task) => {
    const matchesSearch = (task.text || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());
    const priority = normalizePriority(task.priority);
    const matchesPriority = priorityFilter === "All" || priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  let scopedTasks = filteredBySearchAndPriority;

  if (activeView === "Today") {
    scopedTasks = scopedTasks.filter((task) => task.dueDate === today);
  } else if (activeView === "Important") {
    scopedTasks = scopedTasks.filter((task) => normalizePriority(task.priority) === "High");
  } else if (activeView === "Work" || activeView === "Personal" || activeView === "Shopping") {
    scopedTasks = scopedTasks.filter((task) => task.category === activeView);
  } else if (activeView === "Completed") {
    scopedTasks = scopedTasks.filter((task) => task.completed);
  }

  const viewTasks = scopedTasks.filter((task) => {
    if (activeView === "Completed") return true;
    if (listTab === "active") return !task.completed;
    if (listTab === "completed") return task.completed;
    return true;
  });

  const totalTasks = scopedTasks.length;
  const completedTasks = scopedTasks.filter((task) => task.completed).length;
  const pendingTasks = scopedTasks.filter((task) => !task.completed).length;

  const priorityColors = {
    High: "bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-300",
    Medium: "bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-300",
    Low: "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300",
  };

  const priorityFlagColors = {
    High: "text-rose-400",
    Medium: "text-amber-400",
    Low: "text-blue-400",
  };

  const progressTotal = sourceTasks.length;
  const progressDone = sourceTasks.filter((task) => task.completed).length;
  const progressPct = progressTotal ? Math.round((progressDone / progressTotal) * 100) : 0;
  const showPills = activeView !== "Completed";
  const showComposer = activeView !== "Completed" && listTab !== "completed";

  const addTask = async () => {
    if (newTask.trim() === "") return;
    const priority = normalizePriority(newPriority);

    if (demo) {
      const demoTask = {
        _id: `demo-${Date.now()}`,
        text: newTask.trim(),
        description: "",
        priority,
        dueDate: newDueDate,
        dueTime: "",
        category: newCategory,
        completed: false,
      };
      setTasks((prev) => [...prev, demoTask]);
      setNewTask("");
      setNewPriority("Medium");
      setNewDueDate("");
      setPriorityFilter("All");
      setListTab("all");
      return;
    }

    try {
      const user = getCurrentUser();
      const response = await fetch(TASK_API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          text: newTask.trim(),
          description: "",
          priority,
          dueDate: newDueDate,
          category: newCategory,
          userId: user?._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) => [...prev, data.task]);
        setNewTask("");
        setNewPriority("Medium");
        setNewDueDate("");
        setPriorityFilter("All");
        setListTab("all");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (id) => {
    const currentTask = sourceTasks.find((task) => task._id === id);
    if (!currentTask) return;

    if (demo) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
      return;
    }

    try {
      const response = await fetch(`${TASK_API}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          completed: !currentTask.completed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) =>
          prev.map((task) => (task._id === id ? data.task : task))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    if (demo) {
      setTasks((prev) => prev.filter((task) => task._id !== id));
      return;
    }

    try {
      const response = await fetch(`${TASK_API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const duplicateTask = async (task) => {
    const priority = normalizePriority(task.priority);
    if (demo) {
      const duplicatedTask = {
        ...task,
        _id: `demo-${Date.now()}`,
        text: `${task.text} (copy)`,
        priority,
        completed: false,
      };
      setTasks((prev) => [...prev, duplicatedTask]);
      return;
    }

    try {
      const user = getCurrentUser();
      const response = await fetch(TASK_API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          text: `${task.text} (copy)`,
          description: task.description,
          priority,
          dueDate: task.dueDate,
          dueTime: task.dueTime || "",
          category: task.category,
          completed: false,
          userId: user?._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) => [...prev, data.task]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveEdit = async (updatedFields) => {
    const payload = {
      ...updatedFields,
      priority: normalizePriority(updatedFields.priority),
    };

    if (demo) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === editingTask._id ? { ...task, ...payload } : task
        )
      );
      setEditingTask(null);
      return;
    }

    try {
      const response = await fetch(`${TASK_API}/${editingTask._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTask._id ? data.task : task
          )
        );
        setEditingTask(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pillClass = (active) =>
    `px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer border-0 ${
      active ? "bg-[#3B82F6] text-white" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="mt-2">
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={saveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 mb-5 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-full opacity-40 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,#dbeafe,transparent_55%)]" />
        <div className="relative">
          <h2 className="text-slate-800 dark:text-slate-100 text-xl font-bold mb-1">
            {activeView === "All Tasks" ? "My Tasks" : activeView}
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            {progressDone} of {progressTotal} tasks completed
          </p>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-md">
            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-slate-400 text-xs mt-2">{progressPct}%</p>
        </div>
      </div>

      {showComposer && (
        <div className="flex gap-2 mb-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-2 items-center flex-wrap">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 min-w-[180px] bg-transparent text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md border-0 focus:outline-none"
          />

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            title="Task priority"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
          />
          <button
            onClick={addTask}
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer border-0 font-medium"
          >
            <FaPlus /> Add Task
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
          {showPills && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setListTab("all")} className={pillClass(listTab === "all")}>
                All
              </button>
              <button type="button" onClick={() => setListTab("active")} className={pillClass(listTab === "active")}>
                Active
              </button>
              <button type="button" onClick={() => setListTab("completed")} className={pillClass(listTab === "completed")}>
                Completed
              </button>
            </div>
          )}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer text-sm"
            title="Filter by priority"
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {activeView === "All Tasks" && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button type="button" onClick={() => setListTab("all")} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl text-center cursor-pointer">
              <p className="text-sm text-slate-400">Total</p>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalTasks}</h2>
            </button>
            <button type="button" onClick={() => setListTab("completed")} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl text-center cursor-pointer">
              <p className="text-sm text-slate-400">Completed</p>
              <h2 className="text-2xl font-bold text-emerald-500">{completedTasks}</h2>
            </button>
            <button type="button" onClick={() => setListTab("active")} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl text-center cursor-pointer">
              <p className="text-sm text-slate-400">Pending</p>
              <h2 className="text-2xl font-bold text-amber-500">{pendingTasks}</h2>
            </button>
          </div>
        )}

        {sourceTasks.length === 0 && (
          <p className="text-slate-400 text-center mt-10">No tasks yet. Add one above!</p>
        )}

        {sourceTasks.length > 0 && viewTasks.length === 0 && (
          <p className="text-slate-400 text-center mt-10">No tasks in this view.</p>
        )}

        {viewTasks.map((task) => {
          const priority = normalizePriority(task.priority);
          return (
            <div
              key={task._id}
              className="flex items-center justify-between bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!task.completed}
                  onChange={() => toggleComplete(task._id)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer rounded-full"
                />
                <div className="flex flex-col">
                  <span className={`text-slate-800 dark:text-slate-100 font-semibold ${task.completed ? "line-through text-slate-400" : ""}`}>
                    {task.text}
                  </span>
                  {task.description && (
                    <span className="text-xs text-slate-400 mt-0.5">{task.description}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${priorityColors[priority]}`}>
                  <FaFlag className={`text-xs ${priorityFlagColors[priority]}`} />
                  {priority}
                </span>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <FaRegCalendarAlt className="text-blue-400" />
                    <span className={task.dueDate === today && !task.completed ? "text-rose-400 font-medium" : ""}>
                      {task.dueDate}
                      {task.dueTime ? ` ${task.dueTime}` : ""}
                    </span>
                  </div>
                )}
                <TaskMenu
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => deleteTask(task._id)}
                  onDuplicate={() => duplicateTask(task)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodoList;
