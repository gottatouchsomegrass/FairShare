import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Loader } from "./Loader";

interface Member {
  userId: Id<"users">;
  name: string;
  email?: string;
}

interface AddPaymentFormProps {
  groupId: Id<"groups">;
  members: Member[];
  onClose: () => void;
}

export function AddPaymentForm({
  groupId,
  members,
  onClose,
}: AddPaymentFormProps) {
  const [fromUserId, setFromUserId] = useState<Id<"users"> | "">(
    members[0]?.userId || ""
  );
  const [toUserId, setToUserId] = useState<Id<"users"> | "">(
    members[1]?.userId || ""
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordPayment = useMutation(api.payments.recordPayment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromUserId || !toUserId || !amount) return;

    if (fromUserId === toUserId) {
      toast.error("Cannot record payment to yourself");
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (amountInCents <= 0) {
      toast.error("Amount must be positive");
      return;
    }

    setIsSubmitting(true);
    try {
      await recordPayment({
        groupId,
        fromUserId,
        toUserId,
        amount: amountInCents,
        description: description.trim() || undefined,
        date: new Date(date).getTime(),
      });
      toast.success("Payment recorded successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border mx-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fromUserId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From (who paid) *
          </label>
          <select
            id="fromUserId"
            value={fromUserId}
            onChange={(e) => setFromUserId(e.target.value as Id<"users">)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="toUserId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To (who received) *
          </label>
          <select
            id="toUserId"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value as Id<"users">)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Settling dinner bill"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !fromUserId ||
              !toUserId ||
              !amount ||
              fromUserId === toUserId ||
              isSubmitting
            }
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader className="mx-auto h-5 w-5" />
            ) : (
              "Record Payment"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
