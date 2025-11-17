import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../utils/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const firebaseTopics = [
    {
      title: "Firebase Authentication",
      desc: "User authentication system with Email/Password, Google, GitHub, Phone/OTP, Anonymous login.",
    },
    {
      title: "Firestore Database",
      desc: "NoSQL document-based database with real-time updates.",
    },
    {
      title: "Realtime Database",
      desc: "JSON tree-structured database with millisecond real-time syncing.",
    },
    {
      title: "Cloud Storage",
      desc: "Secure storage for files, images, videos.",
    },
    {
      title: "Firebase Hosting",
      desc: "Host static & dynamic websites with free SSL.",
    },
  ];
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white shadow-sm rounded-xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Firebase <span className="text-blue-600">Complete Guide</span>
        </h1>

        <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-gray-600">
          Explore all Firebase topics including Auth, Database, Storage,
          Hosting, etc.
        </p>

        {user ? (
          <Link to="/dashboard">
            <button className="px-8 mt-5 text-white py-3 bg-green-500 rounded-xl hover:scale-105 transition-transform duration-200 font-bold cursor-pointer">
              Get Started 🚀
            </button>
          </Link>
        ) : (
          <Link to="/auth">
            <button className="px-8 py-3 mt-5 text-white bg-blue-600 rounded-xl hover:scale-105 transition-transform duration-200 font-bold cursor-pointer">
              Sign In 🔐
            </button>
          </Link>
        )}
      </section>

      {/* Topics Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Important Firebase Topics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firebaseTopics.map((topic, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {topic.title}
              </h3>
              <p className="text-gray-600">{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
