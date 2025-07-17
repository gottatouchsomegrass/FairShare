import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GroupList } from "./GroupList";
import { GroupDetails } from "./GroupDetails";
import { InvitationsList } from "./InvitationsList";
import { CreateGroupForm } from "./CreateGroupForm";
import { Id } from "../../convex/_generated/dataModel";
import { Loader } from "./Loader";

export function Dashboard() {
  const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | null>(
    null
  );
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const groups = useQuery(api.groups.getUserGroups);
  const invitations = useQuery(api.groups.getPendingInvitations);

  if (groups === undefined || invitations === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (selectedGroupId) {
    return (
      <GroupDetails
        groupId={selectedGroupId}
        onBack={() => setSelectedGroupId(null)}
      />
    );
  }

  if (showCreateGroup) {
    return (
      <CreateGroupForm
        onCancel={() => setShowCreateGroup(false)}
        onSuccess={() => setShowCreateGroup(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Your Groups</h1>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Create Group
        </button>
      </div>

      {invitations.length > 0 && <InvitationsList invitations={invitations} />}

      <GroupList groups={groups} onSelectGroup={setSelectedGroupId} />
    </div>
  );
}
