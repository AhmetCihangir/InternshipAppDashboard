import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"

const CookiesContext = createContext()

export const CookiesProvider = ({ children }) => {
    const [cookies, setCookies] = useState({})

    useEffect(() => {
      setCookies(Cookies.get())
    }, [])


    const setCookie = (name, value, options = []) => {
        Cookies.set(name, value, options)
        setCookies((prev) => ({...prev, [name] : value}))
    }

    const removeCookie = (name, options = {}) => {
        Cookies.remove(name, options)

        setCookies((prev) => {
            const newCookies = {...prev};
            delete newCookies[name]
            return newCookies
        })
    } 
    


    return <CookiesContext.Provider value={{cookies, setCookie, removeCookie}}>
    {children}
    </CookiesContext.Provider>
}



export const useCookie = () => useContext(CookiesContext)