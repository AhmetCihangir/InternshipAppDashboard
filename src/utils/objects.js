import { db } from "../firebase";
import { collection, setDoc, getDocs } from "firebase/firestore";

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
    #linkedin;
    #clubs;
    #location;
    #university;
    #musics;
    #score = 0;

    constructor(name = "", userID, emails = [], role, department, _3true1wrong = [], highSchool = "", telephone = "", github = "", linkedIn = "", clubs = [], location = "", university = "", musics = [], score) {
        this.#name = name;
        this.#userID = userID;
        this.#emails = emails;
        this.#role = role;
        this.#department = department;
        this.#_3true1wrong = _3true1wrong;
        this.#highSchool = highSchool;
        this.#telephone = telephone;
        this.#github = github;
        this.#linkedin = linkedIn;
        this.#clubs = clubs;
        this.#location = location;
        this.#university = university;
        this.#musics = musics;
        this.#score = score;
    }

    getScore() {
        return this.#score;
    }

    setScore(newScore) {
        this.#score = newScore;
    }

    getMusics() {
        return this.#musics;
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
        return this.#linkedin;
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

    constructor(title, description, dueDate, priority, responsibleUsers, departments, status = 'Pending', value = 0, allUsers = []) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.convertUserIDstoUsers(responsibleUsers, allUsers);
        this.#departments = departments;
        this.#status = status;
        this.#value = value;
        this.#taskID = Date.now().toString(); // Simple unique ID based on timestamp
    }

    convertUserIDstoUsers(userIDs, allUsers ) {
        this.#responsibleUsers = allUsers.filter(user => userIDs.includes(user.getUserID()));
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
        try {
            await setDoc(collection(db, "todos"), {
                taskID: this.#taskID,
                title: this.#title,
                description: this.#description,
                dueDate: this.#dueDate,
                priority: this.#priority,
                responsibleUsers: this.#responsibleUsers.map(user => user.getUserID()),
                departments: this.#departments,
                status: this.#status,
                value: this.#value,
            });
            console.log("ToDo uploaded successfully!");
        } catch (error) {
            console.error("Error uploading ToDo: ", error);
        }
    }
}

async function getAllTodos(allUsers = []) {
    try{
        const querySnapshot = await getDocs(collection(db, "todos"));
        const todos = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const todo = new ToDo(
                data.title,
                data.description,
                data.dueDate,
                data.priority,
                data.responsibleUsers,
                data.departments,
                data.status,
                data.value,
                allUsers
            );
            todos.push(todo);
        });
        return todos;
    } catch (error) {
        console.error("Error fetching ToDos: ", error);
        return [];
    }
}

async function getAllUsers() {
    try{
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const user = new User(
                data.name,
                data.userID,
                data.emails,
                data.role,
                data.department,
                data._3true1wrong,
                data.highSchool,
                data.telephone,
                data.github,
                data.linkedin,
                data.clubs,
                data.location,
                data.university,
                data.musics,
                data.score
            );
            users.push(user);
        });
        return users;
    } catch (error) {
        console.error("Error fetching Users: ", error);
        return [];
    }
}

export { User, ToDo, getAllTodos, getAllUsers };