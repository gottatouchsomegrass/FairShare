import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Loader } from "./Loader";

interface InviteMemberFormProps {
  groupId: Id<"groups">;
  onClose: () => void;
}

export function InviteMemberForm({ groupId, onClose }: InviteMemberFormProps) {
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteToGroup = useMutation(api.groups.inviteToGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setIsSubmitting(true);
    try {
      await inviteToGroup({
        groupId,
        userId: userId.trim() as Id<"users">,
      });
      toast.success("Invitation sent successfully!");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-zinc-700 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Invite Member by User ID
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              User ID (see their profile page)
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              placeholder="Enter User ID"
              required
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="mx-auto h-5 w-5" />
              ) : (
                "Send Invitation"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
