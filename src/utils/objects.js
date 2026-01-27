import { db } from "../firebase";
import { collection, setDoc } from "firebase/firestore";

class User {
    #name;
    #userID;
    #emails;
    #role;
    #department;
    #_3true1wrong;
    #highSchool;
    #telephone;
    #github;
    #linkedIn;
    #clubs;
    #location;
    #university;

    constructor(name = "", userID, emails = [], role, department, _3true1wrong = [], highSchool = "", telephone = "", github = "", linkedIn = "", clubs = [], location = "", university = "") {
        this.#name = name;
        this.#userID = userID;
        this.#emails = emails;
        this.#role = role;
        this.#department = department;
        this.#_3true1wrong = _3true1wrong;
        this.#highSchool = highSchool;
        this.#telephone = telephone;
        this.#github = github;
        this.#linkedIn = linkedIn;
        this.#clubs = clubs;
        this.#location = location;
        this.#university = university;
    }

    get3true1wrong() {
        return this.#_3true1wrong;
    }

    set3true1wrong(questions) {
        this.#_3true1wrong = questions;
    }

    getName() {
        return this.#name;
    }

    getUserID() {
        return this.#userID;
    }

    getEmails() {
        return this.#emails;
    }

    getRole() {
        return this.#role;
    }

    getDepartment() {
        return this.#department;
    }

    getHighSchool() {
        return this.#highSchool;
    }

    getTelephone() {
        return this.#telephone;
    }

    getGithub() {
        return this.#github;
    }

    getLinkedIn() {
        return this.#linkedIn;
    }

    getClubs() {
        return this.#clubs;
    }

    getLocation() {
        return this.#location;
    }

    getUniversity() {
        return this.#university;
    }
}

class ToDo {
    #title; // title of the task
    #description; // optional
    #dueDate; // ?? 
    #priority; // e.g., 'Low', 'Medium', 'High' or numerical value like Fibonacci sequence
    #responsibleUsers; // Array of User objects
    #departments; // departments responsible for the task
    #status; // e.g., 'Pending', 'In Progress', 'Completed'
    #value; // 1-10 
    #taskID;

    constructor(title, description, dueDate, priority, responsibleUsers, departments, status = 'Pending', value = 0) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#responsibleUsers = responsibleUsers;
        this.#departments = departments;
        this.#status = status;
        this.#value = value;
        this.#taskID = Date.now().toString(); // Simple unique ID based on timestamp
    }

    getTitle() {
        return this.#title;
    }

    getDescription() {
        return this.#description;
    }

    getDueDate() {
        return this.#dueDate;
    }

    getPriority() {
        return this.#priority;
    }

    getResponsibleUsers() {
        return this.#responsibleUsers;
    }

    getDepartments() {
        return this.#departments;
    }

    getStatus() {
        return this.#status;
    }

    getValue() {
        return this.#value;
    }

    getTaskID() {
        return this.#taskID;
    }

    setStatus(newStatus) {
        this.#status = newStatus;
    }

    async uploadToFirebase() {
        
    
    }


}

export { User, ToDo };