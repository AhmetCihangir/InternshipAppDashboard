import { createContext, useContext, useState } from "react"

const StateContext = createContext()

export const StateProvider = ({ children }) => {
    const [pageIndex, setPageIndex] = useState(-1);
    const [internList, setInternList] = useState([])


    return <StateContext.Provider value={{pageIndex, setPageIndex, internList, setInternList}}>
    {children}
    </StateContext.Provider>
}



export const useStateContext = () => useContext(StateContext)