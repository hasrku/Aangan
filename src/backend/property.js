import { form } from "framer-motion/client";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";

export const uploadProperty = async (formData, user) => {
    console.log(formData, user);
    // ✅ Step 1: Basic validation
    const requiredFields = ["title", "price", "listingType", "location"];
    for (const field of requiredFields) {
        if (!formData[field]) {
            throw new Error(`Please fill out the ${field} field`);
        }
    }

    if (!user?.sub) {
        throw new Error("User not authenticated");
    }

    // ✅ Step 2: Prepare data for Supabase
    const propertyData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        price: parseFloat(formData.price),
        listing_type: formData.listingType,
        location: formData.location.trim(),
        property_type: formData.propertyType || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        furnishing_status: formData.furnishingStatus || null,
        user_id: user.sub, // foreign key
    };

    // ✅ Step 3: Insert into Supabase
    const { data, error } = await supabase.from("properties").insert([propertyData]).select();

    if (error) {
        console.error("Error uploading property:", error);
        throw new Error(error.message);
    }

    return data[0];
};

// Fetch properties uploaded by current user
export const fetchUserProperties = async (userId) => {
    try {
        const { data, error } = await supabase.from("properties").select("*").eq("user_id", userId).order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error fetching user properties:", err);
        toast.error("Failed to load your listings");
        return [];
    }
};

// Delete property by ID
export const deleteProperty = async (propertyId) => {
    try {
        const { error } = await supabase.from("properties").delete().eq("id", propertyId);

        if (error) throw error;
        toast.success("Property deleted successfully!");
        return true;
    } catch (err) {
        console.error("Error deleting property:", err);
        toast.error("Failed to delete property");
        return false;
    }
};

export const fetchPropertyById = async (id) => {
    try {
        // 1️⃣ Fetch property
        const { data: property, error: propertyError } = await supabase.from("properties").select("*").eq("id", id).single();

        if (propertyError) throw propertyError;

        // 2️⃣ Fetch owner details using user_id
        const { data: owner, error: ownerError } = await supabase
            .from("users")
            .select("firstName, lastName, phone, email")
            .eq("id", property.user_id)
            .single();

        if (ownerError) throw ownerError;

        return { ...property, owner }; // attach owner data
    } catch (err) {
        console.error("Error fetching property:", err);
        toast.error("Failed to load property details");
        return null;
    }
};

// Fetch all properties with optional owner info
export const fetchAllProperties = async () => {
    try {
        const { data, error } = await supabase.from("properties").select(`*`);

        if (error) throw error;

        return data;
    } catch (err) {
        console.error("Error fetching properties:", err);
        toast.error("Failed to fetch properties");
        return [];
    }
};
