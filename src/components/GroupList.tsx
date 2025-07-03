import { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

interface Group {
  _id: Id<"groups">;
  _creationTime: number;
  name: string;
  description?: string;
  createdBy: Id<"users">;
  createdAt: number;
  creatorName: string;
}

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (groupId: Id<"groups">) => void;
}

export function GroupList({ groups, onSelectGroup }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          key="empty"
          className="text-center py-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="text-gray-400 text-lg mb-4">No groups yet</div>
          <p className="text-gray-600">
            Create your first group to start splitting expenses!
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {groups.map((group, i) => (
          <motion.div
            key={group._id}
            onClick={() => onSelectGroup(group._id)}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeInOut" }}
          >
            <h3 className="text-xl font-semibold text-primary mb-2">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-gray-600 mb-3">{group.description}</p>
            )}
            <div className="text-sm text-gray-500">
              <p>Created by {group.creatorName}</p>
              <p>{new Date(group.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
