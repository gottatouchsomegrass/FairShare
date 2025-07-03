import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

interface Invitation {
  _id: Id<"groupMembers">;
  groupId: Id<"groups">;
  groupName: string;
  inviterName: string;
  invitedAt: number;
}

interface InvitationsListProps {
  invitations: Invitation[];
}

export function InvitationsList({ invitations }: InvitationsListProps) {
  const respondToInvitation = useMutation(api.groups.respondToInvitation);

  const handleResponse = async (groupId: Id<"groups">, accept: boolean) => {
    try {
      await respondToInvitation({ groupId, accept });
      toast.success(accept ? "Invitation accepted!" : "Invitation declined");
    } catch (error) {
      toast.error("Failed to respond to invitation");
    }
  };

  if (invitations.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          key="empty"
          className="text-center py-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="text-gray-400 text-lg mb-2">No invitations</div>
          <p className="text-gray-600">
            You have no pending group invitations.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        Pending Invitations ({invitations.length})
      </h2>
      <div className="space-y-3">
        <AnimatePresence>
          {invitations.map((invitation, i) => (
            <motion.div
              key={invitation._id}
              className="bg-white p-4 rounded-lg shadow-sm border"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeInOut" }}
            >
              <div>
                <h3 className="font-medium text-gray-900">
                  {invitation.groupName}
                </h3>
                <p className="text-sm text-gray-600">
                  Invited by {invitation.inviterName} on{" "}
                  {new Date(invitation.invitedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(invitation.groupId, true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(invitation.groupId, false)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
