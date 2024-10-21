"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      setError("Error fetching tasks");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });

      if (res.ok) {
        const task = await res.json();
        setTasks([...tasks, task]);
        setNewTask("");
      } else {
        setError("Error adding task");
      }
    } catch (error) {
      setError("Error adding task");
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (res.ok) {
        setTasks(
          tasks.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (error) {
      setError("Error updating task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId));
      }
    } catch (error) {
      setError("Error deleting task");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      setError("Error logging out");
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className=" rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleAddTask} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="flex-1 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </div>
          </form>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task._id)}
                    className="h-4 w-4 text-black focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span
                    className={
                      task.completed ? "line-through " : ""
                    }
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>

                <button
                  onClick={handleLogout}
                  className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
