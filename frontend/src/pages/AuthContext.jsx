import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const accessToken =
        localStorage.getItem("access_token");


    const getUser = async () => {

        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {

            const response = await api.get(
                "auth/me/"
            );

            setUser(response.data);

        } catch (error) {

            console.error(
                "Failed to get user:",
                error
            );

            logout();

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        getUser();
    }, []);


    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}