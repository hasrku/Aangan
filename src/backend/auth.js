import { supabase } from "../utils/supabaseClient";

// 🔸 Sign up new user
export const signUpUser = async ({ firstName, lastName, email, phone, password, role = "user" }) => {
    if (!firstName || !lastName || !email || !phone || !password) {
        throw new Error("All fields are required");
    }

    // 1️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { firstName, lastName, phone, role },
        },
    });

    if (authError) throw authError;

    // 2️⃣ Store user in "users" table (if you want a profile table)
    const user = authData.user;
    if (user) {
        const { error: dbError } = await supabase.from("users").insert([
            {
                id: user.id, // match Supabase auth user id
                firstName,
                lastName,
                email,
                password,
                phone,
                role,
            },
        ]);

        if (dbError && dbError.code !== "23505") throw dbError; // skip duplicate error
    }
    console.log("user : ", authData);

    return authData;
};

// 🔸 Login user
export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("user data: ", data);

    if (error) throw error;

    return data;
};

// 🔸 Logout user
export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// 🔸 Get currently logged in user
export const getCurrentUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
};
