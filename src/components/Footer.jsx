import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { auth } from "../utils/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/"); // Redirect to Home after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Links dynamically based on user auth
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    user && { name: "JobForm", path: "/jobform" },
    user && { name: "Dashboard", path: "/dashboard" },
    !user && { name: "Register", path: "/register" },
    !user && { name: "Login", path: "/login" },
  ].filter(Boolean); // Remove null entries

  return (
    <footer className="bg-indigo-700 text-white w-full mt-16 pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Firebase</h2>
          <p className="text-sm text-indigo-100 leading-6">
            Firebase Complete Notes — A full guide written by Zubair Pro Coder
            to understand Firebase simply and practically.
          </p>

          <p className="mt-4 text-sm text-indigo-100">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="flex flex-col space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`transition-all px-3 py-2 text-sm rounded-xl block ${
                      isActive ? "bg-blue-600" : "hover:bg-blue-500/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {/* Logout Button */}
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="transition-all px-3 py-2 text-sm bg-red-500 rounded-xl hover:bg-red-600 w-full text-left"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MdEmail size={18} /> <span>zubair@firebase.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhone size={18} /> <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaMapMarkerAlt size={18} /> <span>Pakistan, Punjab</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Me</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-200">
              <FaGithub size={22} />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaFacebook size={22} />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CopyRight */}
      <div className="text-center py-6 mt-6 border-t border-indigo-600 text-sm">
        Created by <span className="font-bold">Zubair Pro Coder</span>
      </div>
    </footer>
  );
};

export default Footer;
