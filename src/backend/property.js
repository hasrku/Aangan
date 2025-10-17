import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// Helper function to compress image below 900 KB
const compressImage = async (file) => {
    if (file.size <= 900 * 1024) return file; // No need to compress

    const MAX_SIZE = 900 * 1024; // 900 KB
    const img = new Image();
    const reader = new FileReader();

    // Wait for image to load
    const imageLoadPromise = new Promise((resolve, reject) => {
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        img.onload = () => resolve();
        img.onerror = reject;
    });

    reader.readAsDataURL(file);
    await imageLoadPromise;

    // Create canvas to draw the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let width = img.width;
    let height = img.height;
    let quality = 0.9; // initial quality

    let blob;
    do {
        // Reduce dimensions slightly each iteration
        width *= 0.9;
        height *= 0.9;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob (JPEG)
        blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

        // Reduce quality gradually
        quality -= 0.1;
    } while (blob.size > MAX_SIZE && quality > 0.3);

    // Convert Blob back to File for upload
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
};

export const uploadProperty = async (formData, user, images) => {
    try {
        const uploadedImageUrls = [];
        if (!user) throw new Error("User not authenticated");

        for (const image of images.slice(0, 4)) {
            if (!image.type.startsWith("image/")) {
                throw new Error(`File ${image.name} is not an image`);
            }

            // Compress manually if >900 KB
            const compressedImage = await compressImage(image);

            const fileName = `${uuidv4()}_${compressedImage.name}`;
            const { error: uploadError } = await supabase.storage.from("images").upload(fileName, compressedImage, {
                contentType: compressedImage.type,
                upsert: false,
            });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);

            uploadedImageUrls.push(publicUrlData.publicUrl);
        }

        // ✅ Save property details
        const { data, error } = await supabase.from("properties").insert([
            {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                listing_type: formData.listingType,
                location: formData.location,
                property_type: formData.propertyType,
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
                area: formData.area,
                furnishing_status: formData.furnishingStatus,
                user_id: user.sub,
                images: uploadedImageUrls,
            },
        ]);

        if (error) throw error;
        toast.success("Property added successfully!");
        return data;
    } catch (error) {
        console.error("Error uploading property:", error);
        toast.error(error.message || "Failed to upload property");
        throw error;
    }
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
