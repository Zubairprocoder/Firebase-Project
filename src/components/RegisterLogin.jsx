import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import { auth, googleProvider, facebookProvider } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Listen Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle redirect result for mobile logins
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  // Email Register/Login
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Basic validation
      if (!data.email || !data.password || (isRegister && !data.fullname)) {
        toast.error("Please enter a valid email, password, and name.");
        setLoading(false);
        return;
      }

      if (isRegister) {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        // Save full name
        if (data.fullname) {
          await updateProfile(res.user, { displayName: data.fullname });
        }

        toast.success("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Login successful!");
      }

      reset();
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already in use, please login.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  // GOOGLE LOGIN with fallback for mobile storage issue
  const handleGoogleLogin = async () => {
    try {
      if (window.innerWidth < 768) {
        // Mobile try redirect
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.log("Redirect failed, falling back to popup:", redirectError);
          // fallback to popup
          await signInWithPopup(auth, googleProvider);
        }
      } else {
        await signInWithPopup(auth, googleProvider); // Desktop
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // FACEBOOK LOGIN
  // Facebook login
  const handleFacebookLogin = async () => {
    try {
      if (window.innerWidth < 768) {
        // MOBILE: Redirect
        await signInWithRedirect(auth, facebookProvider);
      } else {
        // DESKTOP: Popup
        const result = await signInWithPopup(auth, facebookProvider);
        toast.success("Logged in with Facebook!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        toast.error(
          "Account exists with different credential. Please login using your email/password or Google first.",
          { position: "top-center", autoClose: 5000 }
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  // Get redirect result (for mobile)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          toast.success("Logged in with Facebook!");
          navigate("/dashboard");
        }
      })
      .catch((err) => console.error("Redirect result error:", err));
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // If user logged in
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">
          Welcome {user.displayName || user.email}
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 hover:scale-105 transition-transform font-semibold cursor-pointer"
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

        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
        />

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
            className={`w-full bg-blue-600 hover:scale-105 transition-transform text-white py-3 rounded-xl font-bold shadow-md cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
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

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl shadow-md hover:bg-gray-100 hover:scale-105 transition font-semibold cursor-pointer"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* FACEBOOK LOGIN */}
        <button
          onClick={handleFacebookLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl shadow-md hover:bg-gray-100 hover:scale-105 transition font-semibold cursor-pointer"
        >
          <FaFacebook color="#1877F2" size={24} />
          Continue with Facebook
        </button>
      </motion.div>
    </div>
  );
}
