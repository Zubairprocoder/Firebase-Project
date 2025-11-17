import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { auth } from "../utils/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  // Links for logged-in users
  const links = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/auth" },
    user && { name: "Dashboard", path: "/dashboard" },
    user && { name: "About", path: "/about" },
    user && { name: "JobForm", path: "/jobform" },
  ].filter(Boolean);

  return (
    <nav className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold tracking-wide">
          Firebase
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 font-semibold transition-all ${
                location.pathname === link.path
                  ? "bg-blue-600 rounded-xl"
                  : "hover:bg-blue-500 rounded-xl"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded-xl hover:bg-red-600 font-semibold cursor-pointer hover:scale-105 transition-transform"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          {!user ? (
            // Sign In button when logged out
            <Link
              to="/auth"
              className="text-white text-xl p-2 bg-blue-600 rounded-full hover:scale-105 transition-transform"
            >
              <FaUser />
            </Link>
          ) : (
            // Hamburger when logged in
            <button onClick={() => setOpen(true)}>
              <FaBars size={26} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && user && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          ></div>

          <div
            className={`fixed top-0 left-0 h-full text-white shadow-xl transform transition-transform duration-300 z-50 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ width: "90%", backgroundColor: "#432DD7" }}
          >
            <div className="flex justify-between items-center px-4 py-4 border-b border-white/20">
              <Link
                to="/"
                className="text-xl font-bold"
                onClick={() => setOpen(false)}
              >
                Firebase
              </Link>
              <button onClick={() => setOpen(false)}>
                <FaTimes size={26} />
              </button>
            </div>

            <div className="flex flex-col mt-4 space-y-2 px-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    location.pathname === link.path
                      ? "bg-pink-500 text-white"
                      : "hover:bg-pink-300/30"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="px-4 py-2 mt-2 bg-red-500 rounded-xl hover:bg-red-600 font-semibold cursor-pointer hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
