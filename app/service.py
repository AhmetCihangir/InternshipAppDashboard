#imports
from typing import Dict, Optional, List
from classes import ToDo

class ToDoService:
    def __init__(self) -> None:
        self._tasks: Dict[str, ToDo] = {}

    def create_task(self, task: ToDo) -> ToDo:
        self._tasks[task.taskID] = task
        return task

    def delete_task(self, task_id: str, request_user_id: str) -> bool:
        task = self._tasks.get(task_id)
        if not task:
            return False

        if task.createdBy.get("userID") != request_user_id:
            raise PermissionError("Only the creator can delete this task.")

        del self._tasks[task_id]
        return True

    def mark_completed(self, task_id: str, request_user_id: str) -> Optional[ToDo]:
        task = self._tasks.get(task_id)
        if not task:
            return None

        if not self._can_modify(task, request_user_id):
            raise PermissionError("Not allowed to modify this task.")

        task.status = "Completed"
        return task

    def mark_not_completed(self, task_id: str, request_user_id: str) -> Optional[ToDo]:
        task = self._tasks.get(task_id)
        if not task:
            return None

        if not self._can_modify(task, request_user_id):
            raise PermissionError("Not allowed to modify this task.")

        task.status = "Pending"
        return task

    def list_tasks(self) -> List[ToDo]:
        return list(self._tasks.values())

    def _can_modify(self, task: ToDo, user_id: str) -> bool:
        if task.createdBy.get("userID") == user_id:
            return True
        return any(u.get("userID") == user_id for u in task.responsibleUsers)