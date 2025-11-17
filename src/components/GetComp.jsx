import React, { useEffect, useState } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { db } from "../utils/Firebase";

// ------------------ SearchBox Component ------------------
const SearchBox = ({ users, setSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearch(searchValue);

    // Show toast if no match and value is not empty
    if (searchValue.trim() !== "") {
      const found = users.some((u) =>
        (u.fullName || "").toLowerCase().includes(searchValue.toLowerCase())
      );
      if (!found) {
        toast.error("No user found! Try another search.", {
          position: "top-center",
          id: "no-user",
        });
      }
    }
  }, [searchValue, users, setSearch]);

  return (
    <div className="max-w-md mx-auto my-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        🔍 Search Users
      </h3>

      <div className="flex flex-col md:flex-row gap-4 space-x-3 items-center">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name, email, or ID..."
          className="md:flex-1 w-full px-4 p-3 bg-fuchsia-700 rounded-xl focus:outline-none 
                     border-none text-white font-semibold placeholder-white text-base 
                     transition-colors duration-300"
        />

        <button
          onClick={() => setSearch(searchValue)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold rounded-xl transition-all md:w-auto w-full cursor-pointer hover:scale-105"
        >
          Search
        </button>
      </div>
    </div>
  );
};

// ------------------ Main Component ------------------
const GetComp = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const userRef = ref(db, "User");
    setLoading(true);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const userArray = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setUsers(userArray);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const deleteUser = async (id) => {
    try {
      await remove(ref(db, `User/${id}`));
      toast.success("User deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user.");
    }
  };

  const updatePassword = async (id) => {
    try {
      await update(ref(db, `User/${id}`), { password: "talokar804" });
      toast.success("Password updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password.");
    }
  };

  // 🔍 Filter users based on live search
  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.id?.toLowerCase().includes(text)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-bold text-gray-500 animate-pulse">
          Loading...
        </div>
        <div className="w-1/2 bg-gray-300 rounded-xl overflow-hidden">
          <div className="h-4 bg-green-600 rounded-xl animate-[progress_2s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl container mx-auto px-4 py-6">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
        Users List 📃
      </h2>

      {/* Search Component */}
      <SearchBox users={users} setSearch={setSearch} />

      {filteredUsers.length === 0 ? (
        <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg text-center">
          No matching users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="bg-indigo-700 shadow-xl rounded-3xl border border-gray-200 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Link
                to={`/user/${user.id}`}
                className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-2xl p-4 mb-6 flex justify-between items-start gap-3 flex-col"
              >
                <h3 className="text-lg font-bold capitalize underline decoration-white underline-offset-4 decoration-2">
                  {index + 1}. {user.fullName || "No Name"}
                </h3>
              </Link>

              <div className="space-y-3 text-black">
                <div className="bg-blue-100 rounded-xl p-3 flex items-center">
                  <span className="font-bold mr-2">Email :</span>
                  <span className="text-blue-700 break-all text-center">
                    {user.email || "-"}
                  </span>
                </div>

                <div className="bg-yellow-100 rounded-xl p-3 flex items-center">
                  <span className="font-bold mr-2">Password :</span>
                  <span className="text-yellow-800 break-all text-center">
                    {user.password || "-"}
                  </span>
                </div>

                <button
                  onClick={() => updatePassword(user.id)}
                  className="bg-blue-600  px-4 p-3 rounded-xl hover:bg-blue-700 transition w-full text-start font-bold cursor-pointer text-white"
                >
                  Update : <span className="text-white text-center"> {user.password || "-"}</span>
                </button>

                <div className="bg-green-100 rounded-xl p-3 flex items-center">
                  <span className="font-bold mr-2">Created At :</span>
                  <span className="text-green-700 text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-pink-600  p-3 rounded-xl hover:bg-pink-700 transition w-full flex items-center justify-between px-5 text-start font-bold cursor-pointer mt-3"
              >
                Delete : <FaTrash className="text-white" size={20} />
              </button>
              <div className="mt-5 text-right text-xs text-gray-400 italic">
                Fetched from Firestore
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetComp;
