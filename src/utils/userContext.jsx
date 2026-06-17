import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { logoutUser } from "../backend/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async (userId) => {
        try {
            const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

            if (error) {
                console.error(error);
                setUser(null);
                return;
            }

            setUser(data);
        } catch (err) {
            console.error(err);
            setUser(null);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                    await loadProfile(session.user.id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AUTH EVENT:", event);

            if (!session?.user) {
                setUser(null);
                return;
            }

            setTimeout(async () => {
                await loadProfile(session.user.id);
            }, 0);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setUser(null);
        window.location.href = "/auth/login";
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                setUser,
                handleLogout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
