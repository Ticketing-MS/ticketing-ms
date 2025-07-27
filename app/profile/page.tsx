"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "edit">("info");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profileusers");
        const data = await res.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Gagal memuat data user");
      }
    };
    fetchUser();
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw);
      const roleToPath: Record<string, string> = {
        admin: "/admin",
        cloud: "/cloud",
        devops: "/devops",
        pm: "/pm",
      };

      if (pathname === "/") {
        const target = roleToPath[user.role] ?? "/";
        router.replace(target);
      }
    } else {
      router.replace("/login");
    }
  }, [router, pathname]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi password
      if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match");
        setLoading(false);
        return;
      }

      // Gunakan avatar lama sebagai default
      let uploadedUrl = user?.avatarUrl;

      // Upload avatar jika ada file baru
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadRes = await fetch("/api/uploadavatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          toast.error("Failed to upload avatar");
          setLoading(false);
          return;
        }

        const uploadData = await uploadRes.json();
        console.log("Avatar upload response", uploadData);

        uploadedUrl = uploadData.url;
      }

      // Kirim permintaan update profil
      const updateRes = await fetch("/api/profileusers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          avatarUrl: uploadedUrl,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        toast.error(errorData.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      // Update tampilan state user
      setUser((prev) =>
        prev ? { ...prev, name, email, avatarUrl: uploadedUrl } : null
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Error updating profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-gray-800">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-200">
        {user && (
          <button
            onClick={() => {
              const roleToPath: Record<string, string> = {
                admin: "/admin",
                cloud: "/cloud",
                devops: "/devops",
                pm: "/pm",
              };
              router.push(roleToPath[user.role] ?? "/");
            }}
            className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            
          </button>
        )}
        <h1 className="text-3xl font-bold mb-2 text-gray-600">My Profile</h1>
        <p className="text-gray-600 mb-6">
          Showing your data information and can change password
        </p>

        {/* Toggle Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded ${
              activeTab === "info"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded ${
              activeTab === "edit"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Change Profile
          </button>
        </div>

        <hr />

        {/* Active Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "info" ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-inner mb-6">
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-lg font-semibold capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Profile & Password
                </h2>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Upload Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-indigo-50 file:text-indigo-700
      hover:file:bg-indigo-100
    "
                  />
                </div>
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <hr className="my-4" />

                {/* Current Password */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1">
                    New Password
                  </label>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile & Password"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
