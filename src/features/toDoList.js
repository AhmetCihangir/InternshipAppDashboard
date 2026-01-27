import { useEffect, useMemo, useState } from "react";
import { Widget } from "../utils/components";

const BASE_URL = "http://localhost:5000";
const API = `${BASE_URL}/todos`;

// Replace later with your real logged-in user id
const REQUEST_USER_ID = "demo-user-1";

async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": REQUEST_USER_ID,
            ...(options.headers || {}),
        },
    });

    const text = await res.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!res.ok) {
        const msg =
            data?.error ||
            data?.message ||
            data?.detail ||
            `${res.status} ${res.statusText}`;
        throw new Error(msg);
    }

    return data;
}

const WidgetToDoList = () => {
    // data
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    // ui
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const [err, setErr] = useState("");

    // create form (matches your backend keys)
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        departments: "", // comma-separated -> array
        value: 0,
        responsibleUsers: "", // comma-separated -> array
    });

    const disabled = loading || creating || !!busyId;

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            const ad = a.status === "Completed";
            const bd = b.status === "Completed";
            return Number(ad) - Number(bd);
        });
    }, [tasks]);

    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const data = await apiFetch(API, { method: "GET" });
            setTasks(Array.isArray(data) ? data : data?.tasks ?? []);
        } catch (e) {
            setErr(e.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const addTask = async () => {
        const title = form.title.trim();
        if (!title || creating) return;

        setErr("");
        setCreating(true);

        const departmentsArr = form.departments
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const responsibleUsersArr = form.responsibleUsers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        try {
            const created = await apiFetch(API, {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description: form.description.trim() || null,
                    dueDate: form.dueDate || null,
                    priority: form.priority || null,
                    departments: departmentsArr,
                    value: Number(form.value) || 0,
                    createdBy: REQUEST_USER_ID,
                    responsibleUsers: responsibleUsersArr,
                    status: "Pending",
                }),
            });

            const task = created?.task ?? created;

            setTasks((prev) => [...prev, task]);
            setSelectedTask(null);
            setForm({
                title: "",
                description: "",
                dueDate: "",
                priority: "",
                departments: "",
                value: 0,
                responsibleUsers: "",
            });
        } catch (e) {
            setErr(e.message || "Failed to create task");
        } finally {
            setCreating(false);
        }
    };

    const toggleTaskStatus = async (task) => {
        if (!task?.taskID || busyId) return;

        setErr("");
        setBusyId(task.taskID);

        const wasCompleted = task.status === "Completed";
        const optimistic = { ...task, status: wasCompleted ? "Pending" : "Completed" };

        setTasks((prev) =>
            prev.map((t) => (t.taskID === task.taskID ? optimistic : t))
        );
        setSelectedTask((prev) => (prev?.taskID === task.taskID ? optimistic : prev));

        try {
            const url = wasCompleted
                ? `${API}/${task.taskID}/uncomplete`
                : `${API}/${task.taskID}/complete`;

            const updated = await apiFetch(url, {
                method: "PATCH",
                body: JSON.stringify({ requestUserId: REQUEST_USER_ID }),
            });

            const updatedTask = updated?.task ?? updated;

            setTasks((prev) =>
                prev.map((t) =>
                    t.taskID === task.taskID
                        ? (updatedTask?.taskID ? updatedTask : optimistic)
                        : t
                )
            );
            setSelectedTask((prev) =>
                prev?.taskID === task.taskID
                    ? (updatedTask?.taskID ? updatedTask : optimistic)
                    : prev
            );
        } catch (e) {
            setTasks((prev) => prev.map((t) => (t.taskID === task.taskID ? task : t)));
            setSelectedTask((prev) => (prev?.taskID === task.taskID ? task : prev));
            setErr(e.message || "Failed to update task");
        } finally {
            setBusyId(null);
        }
    };

    const deleteTask = async (task) => {
        if (!task?.taskID || busyId) return;

        setErr("");
        setBusyId(task.taskID);

        setTasks((prev) => prev.filter((t) => t.taskID !== task.taskID));
        setSelectedTask((prev) => (prev?.taskID === task.taskID ? null : prev));

        try {
            await apiFetch(`${API}/${task.taskID}`, {
                method: "DELETE",
                body: JSON.stringify({ requestUserId: REQUEST_USER_ID }),
            });
        } catch (e) {
            setTasks((prev) => [...prev, task]);
            setErr(e.message || "Failed to delete task");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <Widget title="To Do List" index={4}>
            <style>{`
                /* Base text color */
                .todoScope { color: #fff; }

                /* Form controls should stay white */
                .todoScope input,
                .todoScope textarea,
                .todoScope select {
                color: #fff;
                background: rgba(0,0,0,0.35);
                }

                /* Placeholder text */
                .todoScope input::placeholder,
                .todoScope textarea::placeholder {
                color: rgba(255,255,255,0.55);
                }

                /* Dropdown list itself */
                .todoScope select option {
                color: #000;      /* readable */
                background: #fff;
                }

                /* Buttons text */
                .todoScope button,
                .todoScope .btn {
                color: #fff;
                }

                .todoScope { display:flex; flex-direction:column; gap:12px; }

                .todoScope .form { display:flex; flex-direction:column; gap:10px; }
                .todoScope .row { display:grid; grid-template-columns: 1fr 1fr 110px; gap:10px; }
                .todoScope .actions { display:flex; gap:10px; }

                .todoScope input, .todoScope textarea, .todoScope select {
                    width:100%;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.16);
                    border-radius: 12px;
                    padding: 10px 12px;
                    outline:none;
                    font-size:14px;
                    box-sizing:border-box;
                }
                .todoScope textarea { resize: vertical; min-height: 72px; }
                .todoScope input::placeholder, .todoScope textarea::placeholder { color: rgba(255,255,255,0.55); }
                .todoScope input:focus, .todoScope textarea:focus, .todoScope select:focus {
                    border-color: rgba(255,255,255,0.3);
                    background: rgba(255,255,255,0.10);
                }

                .todoScope .btn {
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 12px;
                    padding: 10px 12px;
                    cursor:pointer;
                    font-size: 13px;
                    line-height:1;
                    transition: background .15s ease, border-color .15s ease, transform .05s ease;
                    user-select:none;
                }
                .todoScope .btn:hover { background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.26); }
                .todoScope .btn:active { transform: translateY(1px); }
                .todoScope .btn:disabled { opacity: .55; cursor: not-allowed; }
                .todoScope .btnGhost { background: transparent; }
                .todoScope .btnDanger { background: rgba(255,0,0,0.16); border-color: rgba(255,0,0,0.26); }

                .todoScope .error {
                    font-size: 12px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    background: rgba(255,0,0,0.14);
                    border: 1px solid rgba(255,0,0,0.28);
                }

                .todoScope ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
                .todoScope .item {
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:12px;
                    padding: 12px 14px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    transition: background .15s ease, border-color .15s ease;
                }
                .todoScope .item:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }
                .todoScope .itemOpen { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.28); }

                .todoScope .main { flex:1; min-width:0; cursor:pointer; }
                .todoScope .title { font-weight: 800; font-size: 14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .todoScope .titleDone { text-decoration: line-through; opacity: .75; }

                .todoScope .sub { margin-top: 6px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; font-size:12px; opacity: .9; }
                .todoScope .muted { opacity: .7; }

                .todoScope .pill {
                    padding: 3px 9px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.18);
                    background: rgba(255,255,255,0.08);
                    font-size: 12px;
                    line-height: 1.2;
                }
                .todoScope .pillPending { background: rgba(255,170,0,0.18); border-color: rgba(255,170,0,0.28); }
                .todoScope .pillDone { background: rgba(0,0,0,0.35); border-color: rgba(255,255,255,0.18); }

                .todoScope .details {
                    margin-top: 12px;
                    padding: 14px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                }
                .todoScope .detailsHeader { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
                .todoScope .detailsTitle { font-weight: 900; font-size: 14px; letter-spacing: .2px; }

                .todoScope .drow {
                    display:grid;
                    grid-template-columns: 120px 1fr;
                    gap:12px;
                    padding: 10px 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .todoScope .dlabel { font-size: 12px; opacity: .7; }
                .todoScope .dval { font-size: 13px; opacity: .95; word-break: break-word; white-space: pre-wrap; }

                .todoScope .dgrid { display:grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

                .todoScope .detailsActions {
                    display:flex;
                    gap:10px;
                    margin-top:12px;
                    padding-top:12px;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }

                @media (max-width: 520px) {
                    .todoScope .row { grid-template-columns: 1fr; }
                    .todoScope .dgrid { grid-template-columns: 1fr; }
                    .todoScope .drow { grid-template-columns: 1fr; gap: 6px; }
                }
            `}</style>

            <div className="todoScope">
                {/* Create form */}
                <div className="form">
                    <input
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Task title (required)"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTask();
                            }
                        }}
                        disabled={disabled}
                    />

                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Task description (optional)"
                        rows={3}
                        disabled={disabled}
                    />

                    <div className="row">
                        <input
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                            disabled={disabled}
                        />

                        <select
                            value={form.priority}
                            onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                            disabled={disabled}
                        >
                            <option value="">Priority (optional)</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <input
                            type="number"
                            value={form.value}
                            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                            placeholder="Value"
                            disabled={disabled}
                        />
                    </div>

                    <input
                        value={form.departments}
                        onChange={(e) => setForm((p) => ({ ...p, departments: e.target.value }))}
                        placeholder="Departments (comma separated, optional)"
                        disabled={disabled}
                    />

                    <input
                        value={form.responsibleUsers}
                        onChange={(e) => setForm((p) => ({ ...p, responsibleUsers: e.target.value }))}
                        placeholder="Responsible users (comma separated IDs, optional)"
                        disabled={disabled}
                    />

                    <div className="actions">
                        <button className="btn" onClick={addTask} disabled={disabled || !form.title.trim()}>
                            {creating ? "Creating..." : "Create task"}
                        </button>
                        <button className="btn btnGhost" onClick={load} disabled={disabled}>
                            Refresh
                        </button>
                    </div>
                </div>

                {err && <div className="error">{err}</div>}

                {/* List + Details */}
                {loading ? (
                    <p className="muted">Loading...</p>
                ) : (
                    <>
                        <ul>
                            {sortedTasks.map((t) => {
                                const done = t.status === "Completed";
                                const isOpen = selectedTask?.taskID === t.taskID;

                                return (
                                    <li
                                        key={t.taskID}
                                        className={`item ${isOpen ? "itemOpen" : ""}`}
                                    >
                                        <div className="main" onClick={() => setSelectedTask(t)}>
                                            <div className={`title ${done ? "titleDone" : ""}`}>
                                                {t.title}
                                            </div>
                                            <div className="sub">
                                                <span
                                                    className={`pill ${
                                                        done ? "pillDone" : "pillPending"
                                                    }`}
                                                >
                                                    {done ? "Completed" : "Pending"}
                                                </span>
                                                {t.dueDate ? <span className="muted">Due: {t.dueDate}</span> : null}
                                                {t.priority ? <span className="muted">• {t.priority}</span> : null}
                                            </div>
                                        </div>

                                        <button
                                            className="btn btnDanger"
                                            onClick={() => deleteTask(t)}
                                            disabled={busyId === t.taskID}
                                            title="Delete"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {selectedTask && (
                            <div className="details">
                                <div className="detailsHeader">
                                    <div className="detailsTitle">Task details</div>
                                    <button className="btn btnGhost" onClick={() => setSelectedTask(null)}>
                                        Close
                                    </button>
                                </div>

                                <div className="drow">
                                    <div className="dlabel">Title</div>
                                    <div className="dval">{selectedTask.title}</div>
                                </div>

                                <div className="drow">
                                    <div className="dlabel">Description</div>
                                    <div className="dval">
                                        {selectedTask.description?.trim() ? selectedTask.description : "—"}
                                    </div>
                                </div>

                                <div className="dgrid">
                                    <div className="drow">
                                        <div className="dlabel">Status</div>
                                        <div className="dval">{selectedTask.status}</div>
                                    </div>

                                    <div className="drow">
                                        <div className="dlabel">Due date</div>
                                        <div className="dval">{selectedTask.dueDate || "—"}</div>
                                    </div>

                                    <div className="drow">
                                        <div className="dlabel">Priority</div>
                                        <div className="dval">{selectedTask.priority || "—"}</div>
                                    </div>

                                    <div className="drow">
                                        <div className="dlabel">Value</div>
                                        <div className="dval">{selectedTask.value ?? 0}</div>
                                    </div>
                                </div>

                                <div className="drow">
                                    <div className="dlabel">Departments</div>
                                    <div className="dval">
                                        {Array.isArray(selectedTask.departments) && selectedTask.departments.length
                                            ? selectedTask.departments.join(", ")
                                            : "—"}
                                    </div>
                                </div>

                                <div className="drow">
                                    <div className="dlabel">Responsible</div>
                                    <div className="dval">
                                        {Array.isArray(selectedTask.responsibleUsers) && selectedTask.responsibleUsers.length
                                            ? selectedTask.responsibleUsers.join(", ")
                                            : "—"}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Widget>
    );
};

export default WidgetToDoList;