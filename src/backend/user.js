import { supabase } from "../utils/supabaseClient";
import { toast } from "react-hot-toast";

export const updateUserProfile = async (updates) => {
    try {
        const { firstName, lastName, email, phone } = updates;

        // ✅ Update Supabase Auth user info
        const { data, error } = await supabase.auth.updateUser({
            email,
            data: { firstName, lastName, phone },
        });

        if (error) throw error;

        // ✅ (Optional) Update your custom `profiles` table too
        const { user } = data;
        if (user) {
            const { error: profileError } = await supabase
                .from("users")
                .update({
                    firstName,
                    lastName,
                    phone,
                    email,
                })
                .eq("id", user.id);

            if (profileError) throw profileError;
        }

        toast.success("Profile updated successfully!");
        console.log("updated user: ", data);
        return { success: true, data };
    } catch (err) {
        console.error("Error updating user profile:", err);
        toast.error(err.message || "Failed to update profile");
        return { success: false, error: err.message };
    }
};
