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

#create todo object
task1 = ToDo(
    title="Finish backend",
    description="Implement API",
    due_date="2026-01-27T10:45:12Z",
    priority="High",
    departments=["Platform"],
    value=5,
    created_by=creator,
    responsible_users=[ayse, mehmet],
)

#convert to json task
created = sv.create_task(task1)
print("\nCREATE:\n", created.to_json())

#mark completed
completed = sv.mark_completed(task1.taskID, "u2")  # u2 marks it
print("\nMARK COMPLETE:\n", completed.to_json())

#mark not completed
pending = sv.mark_not_completed(task1.taskID, "u3")  # u3 marks it
print("\nMARK INCOMPLETE:\n", pending.to_json())

#try delete by wrong user
try:
    sv.delete_task(task1.taskID, "u2")
except Exception as e:
    print("\nDELETE BY NON CREATOR (U2):", e)

#delete by creator
deleted = sv.delete_task(task1.taskID, "u1")
print("\nDELETE BY CREATOR (U1):", deleted)

#get sample.json
with open("sample.json") as file:
    raw = json.load(file)
task2 = service.json_to_todo(raw)
task2_json = task2.to_json()
print()
print(task2)
print(task2_json)