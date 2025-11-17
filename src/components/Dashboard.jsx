import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../utils/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", fullname: "User" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Firestore query: jobApplications collection me email ke basis par document fetch
        const q = query(
          collection(firestore, "jobApplications"),
          where("email", "==", currentUser.email)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser({
            email: currentUser.email,
            fullname: userData.fullname || "User",
          });
        } else {
          setUser({ email: currentUser.email, fullname: "User" });
        }
      } else {
        setUser({ email: "", fullname: "User" });
        navigate("/auth"); // redirect if logged out
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start space-y-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 pt-16">
      {/* Welcome Card */}
      <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow-2xl w-full max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow flex flex-col md:flex-row items-center justify-center text-center">
          Welcome{" "}
          <span className="md:ml-2 mt-1 md:mt-0">
            {user.fullname || "User"} 🎉
          </span>
        </h1>
        <p className="text-white/80 text-lg">{user.email}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          to="/jobform"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg text-center transition-transform transform hover:scale-105"
        >
          Job Form
        </Link>

        <Link
          to="/about"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-xl shadow-lg text-center transition-transform transform hover:scale-105"
        >
          About / Roadmap
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-lg text-center transition-transform transform hover:scale-105 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Info / Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl text-center shadow-lg text-white hover:scale-105 transform transition-transform break-words">
          <h2 className="text-2xl font-bold mb-2">Submitted Jobs</h2>
          <p className="text-lg">12 Applications</p>
        </div>

        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl text-center shadow-lg text-white hover:scale-105 transform transition-transform">
          <h2 className="text-2xl font-bold mb-2">Projects Completed</h2>
          <p className="text-lg">5 Projects</p>
        </div>

        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl text-center shadow-lg text-white hover:scale-105 transform transition-transform">
          <h2 className="text-2xl font-bold mb-2">Next Steps</h2>
          <p className="text-lg">
            Frontend Roadmap → Learn HTML, CSS, JS, Bootstrap (3 Projects),
            React + Tailwind (3 Projects), Next.js + Firebase (5 Major Projects)
          </p>
        </div>
      </div>
    </div>
  );
}
