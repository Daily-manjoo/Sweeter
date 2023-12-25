import { ReactNode, createContext, useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
interface AuthProps {
    children: ReactNode;
}

const AuthContext = createContext({
    user: null as User | null,
})

export const AuthContextProvider = ({children}: AuthProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const auth = getAuth(app);

    useEffect(()=> {
        onAuthStateChanged(auth, (user)=> {
            if(user){
                setCurrentUser(user);
            }else {
                setCurrentUser(null);
            }
        });
    }, [auth]);

    return(
    <AuthContext.Provider value={{user:currentUser}}> {/*어디서든 상태 보낼 수 있게*/}
        {children}
    </AuthContext.Provider>
    )
};

export default AuthContext;