class User {
    #name = "";
    #userID;
    #email;
    #role;
    #department;
    #_3true1wrong;
    
    constructor(name, userID, email, role, department, _3true1wrong = []) {
        this.#name = name;
        this.#userID = userID;
        this.#email = email;
        this.#role = role;
        this.#department = department;
        this.#_3true1wrong = _3true1wrong;
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

    getEmail() {
        return this.#email;
    }

    getRole() {
        return this.#role;
    }

    getDepartment() {
        return this.#department;
    }
}

class ToDo {
    #title; // title of the task
    #description; // optional
    #dueDate; // ?? 
    #priority; // e.g., 'Low', 'Medium', 'High' or numerical value like Fibonacci sequence
    #responsibleUsers; // Array of User objects
    #departments; // departments responsible for the task

    constructor(title, description, dueDate, priority, responsibleUsers, departments) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#responsibleUsers = responsibleUsers;
        this.#departments = departments;
    }
}

export { User, ToDo };