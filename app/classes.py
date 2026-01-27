#imports
import uuid
from datetime import datetime
from datetime import datetime, timezone

class ToDo:
    def __init__(
        self,
        title,
        description=None,
        due_date=None,
        priority=None,
        departments=None,
        value=0,
        created_by=None,    
        responsible_users=None, 
        task_id=None,
        status="Pending"
    ):
        self.taskID = task_id or str(uuid.uuid4())
        self.title = title
        self.description = description
        self.dueDate = due_date
        self.priority = priority
        self.departments = departments or []
        self.status = status
        self.value = value

        self.createdBy = created_by or {"userID": None, "name": None, "emails": []}
        self.responsibleUsers = responsible_users or []
        self.createdAt = datetime.now(timezone.utc).isoformat()

    def mark_completed(self):
        self.status = "Completed"

    def mark_not_completed(self):
        self.status = "Pending"

    def to_dict(self):
        return {
            "taskID": self.taskID,
            "title": self.title,
            "description": self.description,
            "dueDate": self.dueDate,
            "priority": self.priority,
            "departments": self.departments,
            "status": self.status,
            "value": self.value,
            "createdBy": self.createdBy,
            "responsibleUsers": self.responsibleUsers,
            "createdAt": self.createdAt,
        }