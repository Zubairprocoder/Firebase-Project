import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import RegisterLogin from "./components/RegisterLogin"; // merged login/register
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import JobForm from "./components/JobForm";
import AuthHOC from "./utils/AuthHOC";
import Home from "./components/Home";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 w-full xl:container mx-auto xl:py-5 xl:px-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<RegisterLogin />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthHOC>
                <Dashboard />
              </AuthHOC>
            }
          />
          <Route
            path="/jobform"
            element={
              <AuthHOC>
                <JobForm />
              </AuthHOC>
            }
          />
          <Route
            path="/about"
            element={
              <AuthHOC>
                <About />
              </AuthHOC>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
