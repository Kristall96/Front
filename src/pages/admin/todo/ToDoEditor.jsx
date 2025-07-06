import { useState, useEffect } from "react";
import { useCreateToDo, useUpdateToDo } from "../todo/hooks/useToDo";
import secureAxios from "../../../utils/secureAxios";
const initialState = {
  title: "",
  description: "",
  type: "personal",
  assignedTo: "",
  priority: "medium",
  dueDate: "",
  tags: [],
  subtasks: [],
  assignmentNote: "",
  // New for undo/redo
  titleCursor: 0,
  titleVersionsLength: 1,
  descriptionCursor: 0,
  descriptionVersionsLength: 1,
};

const ToDoEditor = ({
  users,
  usersLoading,
  usersError,
  currentUser,
  onCreated,
  onClose,
  todo,
}) => {
  const isEditMode = !!todo;
  const [data, setData] = useState(
    todo
      ? {
          ...todo,
          dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
          titleCursor: todo.titleCursor ?? 0,
          titleVersionsLength: todo.titleVersions?.length ?? 1,
          descriptionCursor: todo.descriptionCursor ?? 0,
          descriptionVersionsLength: todo.descriptionVersions?.length ?? 1,
        }
      : initialState
  );

  const [subtask, setSubtask] = useState("");

  const [undoRedoError, setUndoRedoError] = useState("");
  const [isProcessingVersion, setIsProcessingVersion] = useState(false);
  // ---- Undo/Redo Handlers for Title ----

  const handleUndoTitle = async () => {
    if (isProcessingVersion) return;
    setUndoRedoError("");
    setIsProcessingVersion(true);

    try {
      const { data } = await secureAxios.post(
        `/admin/todos/${todo._id}/title/undo`
      );
      const { todo: updated, looped } = data;

      setData((d) => ({
        ...d,
        title: updated.title,
        titleCursor: updated.titleCursor,
        titleVersionsLength: updated.titleVersionsLength,
      }));

      if (looped) {
        setUndoRedoError("🔁 No more undo steps — reset to latest version.");
      }
    } catch (e) {
      setUndoRedoError(
        e?.response?.data?.message || e.message || "Undo failed."
      );
    } finally {
      setIsProcessingVersion(false);
    }
  };

  const handleRedoTitle = async () => {
    if (isProcessingVersion) return;
    setUndoRedoError("");
    setIsProcessingVersion(true);

    try {
      const { data } = await secureAxios.post(
        `/admin/todos/${todo._id}/title/redo`
      );
      const { todo: updated, looped } = data;

      setData((d) => ({
        ...d,
        title: updated.title,
        titleCursor: updated.titleCursor,
        titleVersionsLength: updated.titleVersionsLength,
      }));

      if (looped) {
        setUndoRedoError("🔁 No more redo steps — reset to first version.");
      }
    } catch (e) {
      setUndoRedoError(
        e?.response?.data?.message || e.message || "Redo failed."
      );
    } finally {
      setIsProcessingVersion(false);
    }
  };

  const handleUndoDescription = async () => {
    if (isProcessingVersion) return;
    setUndoRedoError("");
    setIsProcessingVersion(true);

    try {
      const { data } = await secureAxios.post(
        `/admin/todos/${todo._id}/description/undo`
      );
      const { todo: updated, looped } = data;

      setData((d) => ({
        ...d,
        description: updated.description,
        descriptionCursor: updated.descriptionCursor,
        descriptionVersionsLength: updated.descriptionVersionsLength,
      }));

      if (looped) {
        setUndoRedoError("🔁 No more undo steps — reset to latest version.");
      }
    } catch (e) {
      setUndoRedoError(
        e?.response?.data?.message || e.message || "Undo failed."
      );
    } finally {
      setIsProcessingVersion(false);
    }
  };

  const handleRedoDescription = async () => {
    if (isProcessingVersion) return;
    setUndoRedoError("");
    setIsProcessingVersion(true);

    try {
      const { data } = await secureAxios.post(
        `/admin/todos/${todo._id}/description/redo`
      );
      const { todo: updated, looped } = data;

      setData((d) => ({
        ...d,
        description: updated.description,
        descriptionCursor: updated.descriptionCursor,
        descriptionVersionsLength: updated.descriptionVersionsLength,
      }));

      if (looped) {
        setUndoRedoError("🔁 No more redo steps — reset to first version.");
      }
    } catch (e) {
      setUndoRedoError(
        e?.response?.data?.message || e.message || "Redo failed."
      );
    } finally {
      setIsProcessingVersion(false);
    }
  };

  useEffect(() => {
    if (undoRedoError) {
      const timeout = setTimeout(() => setUndoRedoError(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [undoRedoError]);

  // Use both hooks
  const {
    mutate: createToDo,
    isLoading: isCreating,
    error: createError,
  } = useCreateToDo();

  const {
    mutate: updateToDo,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateToDo();

  // Reset state when modal opens/closes or todo changes
  useEffect(() => {
    setData(
      todo
        ? { ...todo, dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "" }
        : initialState
    );
    setSubtask("");
  }, [todo, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const addSubtask = () => {
    if (subtask.trim()) {
      setData((d) => ({
        ...d,
        subtasks: [...d.subtasks, { text: subtask, done: false }],
      }));
      setSubtask("");
    }
  };

  const removeSubtask = (idx) => {
    setData((d) => ({
      ...d,
      subtasks: d.subtasks.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clone and clean the payload
    let payload = {
      ...data,
      dueDate: data.dueDate || null,
      tags: data.tags.filter(Boolean),
    };

    // Remove personal-only fields for collaborative
    if (payload.type === "collaborative") {
      delete payload.assignedTo;
      delete payload.assignmentNote;
    }

    // Remove any fields that are empty strings
    Object.keys(payload).forEach(
      (key) =>
        (payload[key] === "" || payload[key] === undefined) &&
        delete payload[key]
    );

    if (isEditMode) {
      updateToDo(
        { id: todo._id, ...payload },
        {
          onSuccess: () => {
            setData(initialState);
            if (onCreated) onCreated();
            if (onClose) onClose();
          },
        }
      );
    } else {
      createToDo(payload, {
        onSuccess: () => {
          setData(initialState);
          if (onCreated) onCreated();
          if (onClose) onClose();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-2xl shadow-lg max-w-lg w-full mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditMode ? "Edit To Do" : "Create New To Do"}
        </h2>
        {usersError && (
          <div className="text-red-500 text-sm mb-2">
            Failed to load users: {usersError.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold flex items-center gap-2">
            Title
            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={handleUndoTitle}
                  title="Undo Title"
                  className="px-1"
                  disabled={data.titleCursor === 0 || isProcessingVersion}
                >
                  ⎌
                </button>
                <button
                  type="button"
                  onClick={handleRedoTitle}
                  title="Redo Title"
                  className="px-1"
                  disabled={
                    data.titleCursor === data.titleVersionsLength - 1 ||
                    isProcessingVersion
                  }
                >
                  ↻
                </button>
              </>
            )}
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
            className="block w-full p-2 border rounded mt-1"
            autoFocus
          />
          <label className="block mb-2 flex items-center gap-2">
            Description
            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={handleUndoDescription}
                  title="Undo Description"
                  className="px-1"
                  disabled={data.descriptionCursor === 0 || isProcessingVersion}
                >
                  ⎌
                </button>
                <button
                  type="button"
                  onClick={handleRedoDescription}
                  title="Redo Description"
                  className="px-1"
                  disabled={
                    data.descriptionCursor ===
                      data.descriptionVersionsLength - 1 || isProcessingVersion
                  }
                >
                  ↻
                </button>
              </>
            )}
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className="block w-full p-2 border rounded mt-1"
            rows={3}
          />
          <div className="flex gap-4 mb-2">
            <label className="flex-1">
              Priority
              <select
                name="priority"
                value={data.priority}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="flex-1">
              Due Date
              <input
                type="date"
                name="dueDate"
                value={data.dueDate}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-1"
              />
            </label>
          </div>
          <label className="block mb-2">
            Tags (comma separated)
            <input
              type="text"
              name="tags"
              value={data.tags.join(",")}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
              className="block w-full p-2 border rounded mt-1"
            />
          </label>
          {/* Subtasks */}
          <label className="block mb-2">
            Subtasks
            <div className="flex gap-2 mt-1 mb-2">
              <input
                type="text"
                value={subtask}
                onChange={(e) => setSubtask(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add subtask"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc ml-6">
              {data.subtasks.map((st, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm mb-1">
                  <span>{st.text}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(idx)}
                    className="text-red-400 hover:text-red-700"
                    title="Remove subtask"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </label>
          {/* Type (Personal/Collaborative) */}
          <label className="block mb-2">
            Type
            <select
              name="type"
              value={data.type}
              onChange={handleChange}
              className="block w-full p-2 border rounded mt-1"
            >
              <option value="personal">Personal</option>
              <option value="collaborative">Collaborative</option>
            </select>
          </label>
          {/* Only show assignedTo if personal */}
          {/* Only show assignedTo if personal */}
          {data.type === "personal" && users && currentUser && (
            <label className="block mb-2">
              Assign to
              <select
                name="assignedTo"
                value={data.assignedTo}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-1"
                required
                disabled={usersLoading}
              >
                {usersLoading ? (
                  <option>Loading...</option>
                ) : users.length === 0 ? (
                  <option>No users available</option>
                ) : (
                  <>
                    <option value="">Select user</option>
                    {users
                      .filter((u) => {
                        // Only admins and moderators are assignable
                        if (!["admin", "moderator"].includes(u.role))
                          return false;
                        // Admins CANNOT assign to themselves
                        if (
                          currentUser.role === "admin" &&
                          u._id === currentUser._id
                        )
                          return false;
                        // Moderators: can assign to self or other moderators
                        if (
                          currentUser.role === "moderator" &&
                          u.role !== "moderator" &&
                          u._id !== currentUser._id
                        )
                          return false;
                        return true;
                      })
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.username} ({u.role})
                        </option>
                      ))}
                  </>
                )}
              </select>
            </label>
          )}

          {/* Assignment note (reason) */}
          {data.type === "personal" && (
            <label className="block mb-2">
              Note for assignee (optional)
              <input
                type="text"
                name="assignmentNote"
                value={data.assignmentNote}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-1"
                maxLength={300}
              />
            </label>
          )}
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
          {(createError || updateError) && (
            <div className="mt-3 text-red-500 text-sm">
              {(createError || updateError).message}
            </div>
          )}
          {undoRedoError && (
            <div className="text-red-500 text-sm mt-2">{undoRedoError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ToDoEditor;
