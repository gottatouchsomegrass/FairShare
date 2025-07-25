import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";

export function UserProfile({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    "profile"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useQuery(api.auth.loggedInUser);
  const updateProfile = useMutation(api.users.updateProfile);

  // Initialize form when user data loads or changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6">
          <Loader className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "preferences"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if you need to
                    update your email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
              </form>

              {/* Account Stats */}
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Member since
                    </p>
                    <p className="font-medium">
                      {new Date(user._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Account ID
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs break-all">{user._id}</p>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(user._id);
                          toast.success("User ID copied to clipboard!");
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Coming Soon
                </h3>
                <p className="text-blue-800 dark:text-blue-100 text-sm">
                  User preferences like currency settings, notification
                  preferences, and theme options will be available in a future
                  update.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Planned Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Default currency selection</li>
                  <li>• Email notification preferences</li>
                  <li>• Dark/light theme toggle</li>
                  <li>• Language preferences</li>
                  <li>• Privacy settings</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
