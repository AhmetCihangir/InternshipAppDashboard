from classes import *
from service import ToDoService

sv = ToDoService()

# fake users
creator = {"userID": "u1", "name": "Burak", "emails": ["burak@mail.com"]}
ayse = {"userID": "u2", "name": "Ayşe"}
mehmet = {"userID": "u3", "name": "Mehmet"}

# create a task
task1 = ToDo(
    title="Finish backend",
    description="Implement API",
    due_date="2026-02-01",
    priority="High",
    departments=["Platform"],
    value=5,
    created_by=creator,
    responsible_users=[ayse, mehmet],
)

created = sv.create_task(task1)
print("CREATED:\n", created.to_dict(), "\n")

# mark completed
completed = sv.mark_completed(task1.taskID, "u2")  # Ayşe marks it
print("COMPLETED:\n", completed.to_dict(), "\n")

# mark not completed
pending = sv.mark_not_completed(task1.taskID, "u3")  # Mehmet marks it
print("BACK TO PENDING:\n", pending.to_dict(), "\n")

# try delete with wrong user
try:
    sv.delete_task(task1.taskID, "u2")
except Exception as e:
    print("DELETE BY NON-CREATOR:", e, "\n")

# delete with creator
deleted = sv.delete_task(task1.taskID, "u1")
print("DELETED BY CREATOR:", deleted)