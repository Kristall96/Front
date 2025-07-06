import { useState } from "react";
import {
  useToDos,
  useUpdateToDo,
  useSoftDeleteToDo,
  useRestoreToDo,
  useHardDeleteToDo,
} from "./hooks/useToDo";
import ToDoList from "./ToDoList";
import ToDoEditor from "./ToDoEditor";
import { useAuth } from "../../../context/AuthContext";
import { useAssignableUsers } from "./hooks/useToDo";

// Only Personal/Collaborative outer tabs now!
const TABS = [
  { label: "Personal", key: "personal" },
  { label: "Collaborative", key: "collaborative" },
];

export default function ToDoDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("personal");
  const [showEditor, setShowEditor] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch all assignable users (admins, moderators)
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useAssignableUsers();

  // Fetch ALL todos so the ToDoList inner Trash tab works!
  const { data: todos = [], isLoading, error } = useToDos({ showAll: true });

  // Mutations
  const updateToDo = useUpdateToDo();
  const softDelete = useSoftDeleteToDo();
  const restoreToDo = useRestoreToDo();
  const hardDeleteToDo = useHardDeleteToDo();

  // Handlers
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowEditor(true);
  };

  const handleMarkDone = (todo, status) => {
    if (
      (status === "done" && todo.status !== "done") ||
      (status === "todo" && todo.status === "done")
    ) {
      updateToDo.mutate({ id: todo._id, status });
    }
  };

  const handleDelete = (todo) => {
    if (window.confirm("Move this To Do to trash?")) {
      softDelete.mutate(todo._id);
    }
  };

  const handleRestore = (todo) => {
    if (window.confirm("Restore this To Do from trash?")) {
      restoreToDo.mutate(todo._id);
    }
  };

  const handleHardDelete = (todo) => {
    if (
      window.confirm(
        "This will permanently delete the To Do and cannot be undone. Proceed?"
      )
    ) {
      hardDeleteToDo.mutate(todo._id);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingTodo(null);
  };

  // Sort todos by newest first for all tabs
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-[#10182a] px-0 py-6">
      {/* Outer Tabs: Personal / Collaborative */}
      <div className="flex gap-2 mb-4 items-center px-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded transition font-semibold ${
              tab === t.key
                ? "bg-blue-600 text-white shadow"
                : "bg-[#1c253a] text-slate-200 hover:bg-[#26304c]"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1"></div>
        {/* Show New To Do button only on non-trash tabs */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow"
          onClick={() => {
            setEditingTodo(null);
            setShowEditor(true);
          }}
        >
          + New To Do
        </button>
      </div>

      {/* To Do List (status filtering is inside ToDoList) */}
      <div className="rounded-2xl bg-[#141c2c] p-4 shadow-lg min-h-[200px] mx-6">
        {isLoading && <div className="text-slate-300">Loading...</div>}
        {error && <div className="text-red-500">{error.message}</div>}
        {!isLoading && (
          <ToDoList
            todos={sortedTodos}
            type={tab} // "personal" or "collaborative"
            userId={user?._id}
            userRole={user?.role}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkDone={handleMarkDone}
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
          />
        )}
      </div>
      {/* Modal for editor */}
      {showEditor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[4px]">
          <ToDoEditor
            users={users}
            usersLoading={usersLoading}
            usersError={usersError}
            currentUser={user}
            todo={editingTodo}
            onCreated={handleEditorClose}
            onUpdated={handleEditorClose}
            onClose={handleEditorClose}
          />
        </div>
      )}
    </div>
  );
}
