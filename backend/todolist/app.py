from flask import Flask, request, jsonify
from flask_cors import CORS

from classes import ToDo
from service import ToDoService, json_to_todo

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]}})

svc = ToDoService()

def get_request_user_id():
    """
    Where we read requestUserId from.
    - First try JSON body: {"requestUserId": "..."}
    - Then header: X-User-Id: ...
    - Then query param: ?requestUserId=...
    """
    data = request.get_json(silent=True) or {}
    return (
        data.get("requestUserId")
        or request.headers.get("X-User-Id")
        or request.args.get("requestUserId")
    )

@app.get("/todos")
def list_todos():
    return jsonify([t.to_json() for t in svc.list_tasks()]), 200

@app.post("/todos")
def create_todo():
    data = request.get_json(force=True)
    try:
        # Your json_to_todo expects keys like title, dueDate, createdBy, responsibleUsers, status...
        todo = json_to_todo(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    created = svc.create_task(todo)
    return jsonify(created.to_json()), 201

@app.patch("/todos/<task_id>/complete")
def complete(task_id):
    request_user_id = get_request_user_id()
    if not request_user_id:
        return jsonify({"error": "Missing requestUserId"}), 400

    try:
        updated = svc.mark_completed(task_id, request_user_id)
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    if not updated:
        return jsonify({"error": "Task not found"}), 404

    return jsonify(updated.to_json()), 200

@app.patch("/todos/<task_id>/uncomplete")
def uncomplete(task_id):
    request_user_id = get_request_user_id()
    if not request_user_id:
        return jsonify({"error": "Missing requestUserId"}), 400

    try:
        updated = svc.mark_not_completed(task_id, request_user_id)
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    if not updated:
        return jsonify({"error": "Task not found"}), 404

    return jsonify(updated.to_json()), 200

@app.delete("/todos/<task_id>")
def delete(task_id):
    request_user_id = get_request_user_id()
    if not request_user_id:
        return jsonify({"error": "Missing requestUserId"}), 400

    try:
        ok = svc.delete_task(task_id, request_user_id)
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    if not ok:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"ok": True}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)