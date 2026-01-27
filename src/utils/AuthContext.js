import { createContext, useContext, useEffect, useState } from "react"
import { User } from "./objects"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

import { auth, db } from "../firebase"
import { where, query, collection, getDocs } from "firebase/firestore"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const getUser = async (email) => {
        try {
            const ref = collection(db, "users");

            const q = query(ref, where("emails", "array-contains", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const data = userDoc.data();
                return new User(
                    data.name,
                    data.userID,
                    data.emails,
                    data.role,
                    data.department,
                    data._3true1wrong,
                    data.highSchool,
                    data.telephone,
                    data.github,
                    data.linkedIn,
                    data.clubs,
                    data.location,
                    data.university
                );
            } else {
                console.log("No user found with the provided email.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user by email: ", error);
            return null;
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const fetchedUser = await getUser(currentUser.email);
                setUser(fetchedUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        })

        return () => unsubscribe()
    }, [])


    return <AuthContext.Provider value={{ user, loading, login }}>
        {children}
    </AuthContext.Provider>
}



export const useAuth = () => useContext(AuthContext)