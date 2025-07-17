import { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (groups.length === 0) return;
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [groups]);

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
          <div
            key={group._id}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            onClick={() => onSelectGroup(group._id)}
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 hover:shadow-md transition-shadow cursor-pointer opacity-0 translate-y-10"
          >
            <h3 className="text-xl font-semibold text-primary mb-2">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {group.description}
              </p>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Created by {group.creatorName}</p>
              <p>{new Date(group.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
