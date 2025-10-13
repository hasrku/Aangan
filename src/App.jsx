import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/user/Dashboard";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/home"
                        element={<Home />}
                    />
                    <Route
                        path="/auth/login"
                        element={<Login />}
                    />
                    <Route
                        path="/auth/signup"
                        element={<Signup />}
                    />
                    <Route
                        path="/user/*"
                        element={<Dashboard />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
