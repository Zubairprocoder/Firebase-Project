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
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<RegisterLogin />} />

          {/* Protected Routes */}
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
