import { createContext, useContext, useState } from "react"

const StateContext = createContext()

export const StateProvider = ({ children }) => {
    const [pageIndex, setPageIndex] = useState(-1);
    const [internList, setInternList] = useState([])
    const [todoList, setTodoList] = useState([])

    const updateTodoList = (newTodo) => {
        setTodoList((prev) => [...prev, newTodo])
    }



    return <StateContext.Provider value={{pageIndex, setPageIndex, internList, setInternList, todoList, setTodoList, updateTodoList}}>
    {children}
    </StateContext.Provider>
}



export const useStateContext = () => useContext(StateContext)