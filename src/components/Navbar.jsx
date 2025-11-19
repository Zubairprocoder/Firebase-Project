import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../utils/Firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { uploadPNGToStorage } from "../utils/UploadPng";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();
  const storage = getStorage();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getProfileImage = () => {
    if (user?.photoURL) return user.photoURL;
    return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // default
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    setProfileOpen(false);
  };

  // Change Profile Photo
  const handleChangePhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const downloadURL = await uploadPNGToStorage(file, user.uid);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      window.location.reload();
    };
  };

  // Remove Profile Photo
  const handleRemovePhoto = async () => {
    try {
      if (user?.photoURL) {
        const imageRef = ref(storage, `users/${user.uid}/profile.png`);
        await deleteObject(imageRef);
      }
      await updateProfile(auth.currentUser, {
        photoURL: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
      });
      window.location.reload();
    } catch (err) {
      console.log("Remove Error:", err);
    }
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
        <Link
          to="/"
          className="text-3xl font-bold hover:scale-105 transition-transform"
        >
          Firebase
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 font-semibold transition-all rounded-xl ${
                location.pathname === link.path
                  ? "bg-blue-600"
                  : "hover:bg-blue-500"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* DESKTOP PROFILE */}
          {user && (
            <div ref={profileRef} className="relative">
              <img
                onClick={() => setProfileOpen(!profileOpen)}
                src={getProfileImage()}
                alt="profile"
                className="w-11 h-11 rounded-full border cursor-pointer hover:scale-105 transition-transform"
              />

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-black p-4 rounded-xl shadow-xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      <img
                        src={getProfileImage()}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-lg font-semibold">
                      {user.displayName || user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleChangePhoto}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer hover:scale-105 transition-transform font-semibold"
                  >
                    Change Photo
                  </button>

                  <button
                    onClick={handleRemovePhoto}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 cursor-pointer hover:scale-105 transition-transform font-semibold"
                  >
                    Remove Photo
                  </button>

                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full bg-violet-700 text-white py-2 rounded-lg hover:bg-violet-900 cursor-pointer hover:scale-105 transition-transform font-semibold flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden flex items-center space-x-2">
          {!user ? (
            <Link
              to="/auth"
              className="p-2 bg-blue-600 rounded-full hover:scale-105 transition-transform"
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

      {/* MOBILE SIDEBAR */}
      {open && user && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed top-0 left-0 h-full w-[90%] text-white shadow-xl z-50"
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

            {/* MOBILE PROFILE */}
            <div className="flex flex-col items-center text-center mt-6 gap-5">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <img
                  src={getProfileImage()}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xl font-semibold">
                {user.displayName || user.email}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
              <button
                onClick={handleChangePhoto}
                className="px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 cursor-pointer hover:scale-105 transition-transform font-semibold"
              >
                Change Photo
              </button>

              <button
                onClick={handleRemovePhoto}
                className="px-4 py-2 bg-red-500 rounded-xl hover:bg-red-600 cursor-pointer hover:scale-105 transition-transform font-semibold"
              >
                Remove Photo
              </button>

              <button
                onClick={handleLogout}
                className="mt-2 w-full bg-violet-700 text-white py-2 rounded-lg hover:bg-violet-900 cursor-pointer hover:scale-105 transition-transform font-semibold flex items-center justify-center gap-2"
              > 
                <FaSignOutAlt /> Logout
              </button>
            </div>
            <div className="flex flex-col mt-8 space-y-2 px-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-white/20 rounded-xl font-semibold"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
