import { createContext, useContext, useEffect, useState } from "react"
import { User } from "./objects"
import { useCookie } from "./CookiesContext"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const { cookies } = useCookie()

    useEffect(() => {
        if (!cookies?.ET) {
            setUser(new User("SampleUser", "123", "sample@example.com", "Admin", "IT"))
        } else {
            setUser(new User("SampleUser", "123", "sample@example.com", "Admin", "IT"))
        }
    }, [cookies?.ET])

    return <AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>
}



export const useAuth = () => useContext(AuthContext)