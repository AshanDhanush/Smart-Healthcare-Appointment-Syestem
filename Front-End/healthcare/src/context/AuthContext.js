"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {

        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    console.log(user);
                }
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }

        };
        initializeAuth();
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log(userData);
        setToken(authToken);
        setUser(userData);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

    const updateUser = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const value = useMemo(() => ({
        user, token, login, logout, updateUser, loading
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

 export const useAuth = () => useContext(AuthContext);

