import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../utils/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { convertImageToBlob, uploadPNGToStorage } from "../utils/UploadPng";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [customPNG, setCustomPNG] = useState(null);

  const profileRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Convert Google photo → PNG
  const saveGoogleImageAsPNG = async (currentUser) => {
    if (!currentUser?.photoURL) return null;

    const pngBlob = await convertImageToBlob(currentUser.photoURL);
    const imageURL = await uploadPNGToStorage(pngBlob, currentUser.uid);

    setCustomPNG(imageURL);
  };

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && !customPNG) {
        await saveGoogleImageAsPNG(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get profile image logic
  const getProfileImage = () => {
    if (customPNG) return customPNG;
    if (user?.photoURL) return user.photoURL;
    return null;
  };

  const getFallbackLetter = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    setProfileOpen(false);
    setCustomPNG(null);
  };

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
        <Link to="/" className="text-3xl font-bold tracking-wide hover:scale-105 transition-transform">
          Firebase
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 hover:scale-105  py-2 font-semibold transition-all ${
                location.pathname === link.path
                  ? "bg-blue-600 rounded-xl"
                  : "hover:bg-blue-500 rounded-xl"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Desktop Profile */}
          {user && (
            <div ref={profileRef} className="relative">
              <div
                className="w-11 h-11 rounded-full border-2 overflow-hidden bg-gray-900 text-white flex items-center justify-center cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt="profile"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <FaUser size={20} />
                )}
              </div>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-black p-4 rounded-xl shadow-xl">
                  <div className="flex flex-col items-center gap-2">
                    {/* Profile Image Circle */}
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {getProfileImage() ? (
                        <img
                          src={getProfileImage()}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser size={28} />
                      )}
                    </div>

                    {/* Username */}
                    <p className="text-lg font-semibold">{user.displayName}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 hover:scale-105 cursor-pointer transition-transform font-semibold"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          {!user ? (
            <Link
              to="/auth"
              className="text-white text-xl p-2 bg-blue-600 rounded-full hover:scale-105 transition-transform"
            >
              <FaUser />
            </Link>
          ) : (
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
          />

          <div
            className="fixed top-0 left-0 h-full text-white shadow-xl transform transition-transform duration-300 z-50 w-[90%]"
            style={{ backgroundColor: "#432DD7" }}
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

            {/* PROFILE CENTER IN MOBILE */}
            <div className="flex flex-col items-center text-center mt-6 gap-5">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser size={40} />
                )}
              </div>

              <p className="text-xl font-semibold">{user.displayName}</p>
            </div>

            <div className="flex flex-col mt-8 space-y-2 px-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 rounded-xl font-semibold bg-white/20"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 mt-4 bg-red-500 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform font-semibold"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
