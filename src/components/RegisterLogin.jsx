import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true); // toggle form
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

  // Track auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) navigate("/about");
    });
    return () => unsubscribe();
  }, [navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Login successful!");
      }
      reset();
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out!");
      setUser(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">
          Welcome {user.email}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          {isRegister ? "Sign Up 🚀" : "Login 🔐"}
        </h1>

        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isRegister && (
            <motion.div className="flex flex-col">
              <label className="font-semibold text-blue-700">Full Name</label>
              <input
                type="text"
                {...register("fullname", { required: isRegister })}
                className="p-3 rounded-xl border border-blue-300 focus:ring-2 outline-none"
                placeholder="Enter full name"
              />
              {errors.fullname && (
                <span className="text-red-600">Required</span>
              )}
            </motion.div>
          )}

          <motion.div className="flex flex-col">
            <label className="font-semibold text-blue-700">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="p-3 rounded-xl border border-blue-300 focus:ring-2 outline-none"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-600">Email required</span>
            )}
          </motion.div>

          <motion.div className="flex flex-col relative">
            <label className="font-semibold text-blue-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true, minLength: 6 })}
              className="p-3 rounded-xl border border-blue-300 focus:ring-2 outline-none pr-10"
              placeholder="Enter password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            {errors.password && <span className="text-red-600">6+ chars</span>}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Login"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            {isRegister ? "Login" : "Sign Up"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
