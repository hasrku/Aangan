import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { logoutUser } from "../backend/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Check auth on mount
    useEffect(() => {
        async function checkAuth() {
            const { data, error } = await supabase.auth.getSession();
            if (error) console.error(error);
            setUser(data?.session?.user || null);
            setLoading(false);
        }

        checkAuth();

        // ✅ Subscribe to auth state changes (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user.user_metadata || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // ✅ Logout handler
    const handleLogout = async () => {
        await logoutUser();
        setUser(null);
        window.location.href = "/auth/login"; // ✅ correct way to redirect
    };

    return <UserContext.Provider value={{ user, setUser, loading, handleLogout }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
