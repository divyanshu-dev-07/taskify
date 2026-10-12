import { useState } from "react";
import { FaPlus, FaGripVertical, FaFlag, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { isDemoMode } from "../lib/taskUtils";

function Inbox({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  const inboxTasks = tasks.filter(t => !t.completed);

  const addTask = async () => {
    if (newTask.trim() === "") return;

    if (isDemoMode()) {
      setTasks((prev) => [
        ...prev,
        {
          _id: `demo-${Date.now()}`,
          text: newTask.trim(),
          description: "",
          priority: newPriority,
          dueDate: newDueDate,
          category: "Personal",
          completed: false,
        },
      ]);
      setNewTask("");
      setNewPriority("Medium");
      setNewDueDate("");
      setShowForm(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        "https://taskify-backend-el3h.onrender.com/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: newTask,
            description: "",
            priority: newPriority,
            dueDate: newDueDate,
            userId: user._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setTasks((prev) => [...prev, data.task]);

        setNewTask("");
        setNewPriority("Medium");
        setNewDueDate("");
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markComplete = async (_id) => {
    if (isDemoMode()) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === _id ? { ...task, completed: true } : task
        )
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://taskify-backend-el3h.onrender.com/api/tasks/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: true,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === _id ? data.task : task
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...tasks];
    const draggedId = inboxTasks[dragIndex].id;
    const targetId = inboxTasks[index].id;
    const draggedRealIndex = reordered.findIndex(t => t.id === draggedId);
    const targetRealIndex = reordered.findIndex(t => t.id === targetId);
    const [removed] = reordered.splice(draggedRealIndex, 1);
    reordered.splice(targetRealIndex, 0, removed);
    setTasks(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  const priorityFlagColor = {
    High: "text-red-400",
    Medium: "text-yellow-400",
    Low: "text-green-400",
  };

  return (
    <div className="max-w-4xl">

      {/* ── Task List ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4 shadow-sm">
        {inboxTasks.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            No tasks yet. Add one below!
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {inboxTasks.map((task, index) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 px-4 py-4 transition-colors hover:bg-slate-50 cursor-pointer
                  ${dragIndex === index ? "opacity-50 bg-slate-50" : ""}`}
              >
                <FaGripVertical className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0" />

                {/* Complete Circle */}
                <button
                  onClick={() => markComplete(task._id)}
                  className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 flex-shrink-0 transition-colors cursor-pointer bg-transparent"
                  title="Mark as complete"
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-slate-800 text-sm font-medium truncate">{task.text}</span>
                  {task.dueDate && (
                    <span className="text-xs text-blue-500 mt-0.5">📅 {task.dueDate}</span>
                  )}
                </div>

                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${task.priority === "High" ? "bg-rose-50 text-rose-500" :
                  task.priority === "Medium" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
                  }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add Task Button ── */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors text-sm px-2 cursor-pointer border-0 bg-transparent"
        >
          <FaPlus size={12} />
          <span>Add task</span>
        </button>
      )}

      {/* ── Add Task Form (expandable) ── */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">

          {/* Task name input */}
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Task name"
            autoFocus
            className="bg-transparent text-slate-800 text-sm font-medium focus:outline-none placeholder:text-slate-400 border-b border-slate-200 pb-2"
          />

          {/* Priority + Date row */}
          <div className="flex items-center gap-3">

            {/* Priority */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <FaFlag className={`text-xs ${priorityFlagColor[newPriority]}`} />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="bg-transparent text-slate-600 text-xs focus:outline-none cursor-pointer"
              >
                <option value="High" className="bg-white">High</option>
                <option value="Medium" className="bg-white">Medium</option>
                <option value="Low" className="bg-white">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <FaRegCalendarAlt className="text-blue-500 text-xs" />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-transparent text-slate-600 text-xs focus:outline-none cursor-pointer"
              />
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <button
                onClick={addTask}
                disabled={newTask.trim() === ""}
                className="bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-4 py-1.5 rounded-xl transition-colors font-medium cursor-pointer border-0"
              >
                Add task
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewTask("");
                  setNewPriority("Medium");
                  setNewDueDate("");
                }}
                className="text-slate-400 hover:text-slate-700 text-xs px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
              >
                Cancel
              </button>
            </div>

            {/* Close X */}
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <FaTimes size={14} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default Inbox;