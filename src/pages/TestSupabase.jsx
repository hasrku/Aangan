import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function TestSupabase() {
    useEffect(() => {
        async function runTests() {
            console.log("====================================");
            console.log("SUPABASE TEST START");
            console.log("====================================");

            try {
                console.log("SUPABASE URL:");
                console.log(import.meta.env.VITE_SUPABASE_URL);

                console.log("------------------------------------");

                console.log("1. TESTING SESSION");

                const sessionResult = await supabase.auth.getSession();

                console.log("SESSION RESULT:");
                console.log(sessionResult);

                console.log("------------------------------------");

                console.log("2. TESTING USERS TABLE");

                const usersResult = await supabase.from("users").select("*").limit(1);

                console.log("USERS RESULT:");
                console.log(usersResult);

                console.log("------------------------------------");

                console.log("3. TESTING SPECIFIC USER");

                const userResult = await supabase.from("users").select("*").eq("id", "ffd13e11-9367-42a4-ba59-380a9691afce");

                console.log("SPECIFIC USER RESULT:");
                console.log(userResult);

                console.log("------------------------------------");

                console.log("ALL TESTS FINISHED");
            } catch (err) {
                console.error("TEST ERROR:");
                console.error(err);
            }
        }

        runTests();
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <h1>Supabase Test</h1>
            <p>Open Console (F12)</p>
            <p>Open Network → Fetch/XHR</p>
        </div>
    );
}
