import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore"; // Firestore
import { ref, push, set } from "firebase/database"; // Realtime DB
import { db, firestore } from "../utils/Firebase";

export default function JobForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const docId = Date.now().toString() + Math.floor(Math.random() * 1000);

    try {
      // Firestore save
      await setDoc(doc(firestore, "jobApplications", docId), data);

      // Realtime Database save
      const newRef = push(ref(db, "jobApplications"));
      await set(newRef, data);

      toast.success("Form Submitted Successfully!", {
        position: "top-center",
      });
      reset();
    } catch (err) {
      toast.error("Error saving data: " + err.message, {
        position: "top-center",
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.form
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg space-y-5"
      >
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-4">
          IT Company Job Form
        </h1>

        <ToastContainer />

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-700">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("fullname", {
              required: true,
              minLength: 3,
              maxLength: 40,
            })}
            className="p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.fullname && (
            <span className="text-red-600 text-sm">
              Full name must be 3-40 characters
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            className="p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">
              Valid email is required
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-700">Phone Number</label>
          <input
            type="text"
            placeholder="03XXXXXXXXX"
            {...register("phone", {
              required: true,
              pattern: /^[0-9]{11}$/,
            })}
            className="p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.phone && (
            <span className="text-red-600 text-sm">
              Phone number must be 11 digits
            </span>
          )}
        </div>

        {/* Position */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-700">Position</label>
          <select
            {...register("position", { required: true })}
            className="p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Position</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="uiux">UI/UX Designer</option>
          </select>
          {errors.position && (
            <span className="text-red-600 text-sm">Position is required</span>
          )}
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-700">
            Experience (Years)
          </label>
          <input
            type="number"
            placeholder="0-20"
            {...register("experience", { required: true, min: 0, max: 20 })}
            step={1}
            className="p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.experience && (
            <span className="text-red-600 text-sm">
              Experience must be 0-20 years
            </span>
          )}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md cursor-pointer ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </motion.button>
      </motion.form>
    </div>
  );
}
