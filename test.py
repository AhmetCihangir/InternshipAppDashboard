#imports
import json
from classes import *
import service
from service import ToDoService
sv = ToDoService()

#users
creator = "u1"
ayse = "u2"
mehmet = "u3"

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

#create task
created = sv.create_task(task1)
print("CREATE:\n", created.to_json(), "\n")

#mark completed
completed = sv.mark_completed(task1.taskID, "u2")  # u2 marks it
print("MARK COMPLETE:\n", completed.to_json(), "\n")

#mark not completed
pending = sv.mark_not_completed(task1.taskID, "u3")  # u3 marks it
print("MARK INCOMPLETE:\n", pending.to_json(), "\n")

#try delete by wrong user
try:
    sv.delete_task(task1.taskID, "u2")
except Exception as e:
    print("DELETE BY NON CREATOR (U2):", e, "\n")

#delete by creator
deleted = sv.delete_task(task1.taskID, "u1")
print("DELETE BY CREATOR (U1):", deleted)

#get sample.json
with open("sample.json") as file:
    raw = json.load(file)
task2 = service.json_to_todo(raw)
print(task2)