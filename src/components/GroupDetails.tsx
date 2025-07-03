import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ExpensesList } from "./ExpensesList";
import { PaymentsList } from "./PaymentsList";
import { BalancesSummary } from "./BalancesSummary";
import { AddExpenseForm } from "./AddExpenseForm";
import { AddPaymentForm } from "./AddPaymentForm";
import { InviteMemberForm } from "./InviteMemberForm";
import { GroupSettings } from "./GroupSettings";
import {
  UserIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  PlusCircleIcon,
  BanknotesIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface GroupDetailsProps {
  groupId: Id<"groups">;
  onBack: () => void;
}

export function GroupDetails({ groupId, onBack }: GroupDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    "expenses" | "payments" | "balances"
  >("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  const group = useQuery(api.groups.getGroupDetails, { groupId });
  const expenses = useQuery(api.expenses.getGroupExpenses, { groupId });
  const payments = useQuery(api.payments.getGroupPayments, { groupId });
  const balances = useQuery(api.expenses.getGroupBalances, { groupId });
  const settlements = useQuery(api.payments.getSuggestedSettlements, {
    groupId,
  });

  if (
    group === undefined ||
    expenses === undefined ||
    payments === undefined ||
    balances === undefined ||
    settlements === undefined
  ) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: "expenses" as const, label: "Expenses", count: expenses.length },
    { id: "payments" as const, label: "Payments", count: payments.length },
    { id: "balances" as const, label: "Balances", count: balances.length },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 shadow-sm border mb-2 transition-shadow duration-300 ease-in-out">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ease-in-out flex items-center gap-1 text-gray-600 hover:scale-105 hover:shadow-md"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-primary transition-colors duration-200 ease-in-out">
              {group.name}
            </h1>
            {group.description && (
              <p className="text-gray-600 mt-1 transition-colors duration-200 ease-in-out">
                {group.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGroupSettings(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out flex items-center gap-2 hover:scale-105 hover:shadow-md"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={() => setShowInviteMember(true)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 ease-in-out flex items-center gap-2 hover:scale-105 hover:shadow-md"
          >
            <UserPlusIcon className="w-5 h-5" />
            Invite Member
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200 ease-in-out flex items-center gap-2 hover:scale-105 hover:shadow-md"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add Expense
          </button>
          <button
            onClick={() => setShowAddPayment(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 ease-in-out flex items-center gap-2 hover:scale-105 hover:shadow-md"
          >
            <BanknotesIcon className="w-5 h-5" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Members */}
      <motion.div
        className="bg-white p-4 rounded-lg shadow-sm border transition-shadow duration-300 ease-in-out"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeInOut" }}
      >
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          Members ({group.members.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {group.members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/10 hover:scale-105"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white font-bold text-xs transition-colors duration-200 ease-in-out">
                {member.name.slice(0, 2).toUpperCase()}
              </span>
              {member.name}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ease-in-out ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5 shadow"
                  : "border-transparent text-gray-500 hover:text-primary hover:border-primary/50 hover:scale-105"
              }`}
            >
              {tab.label}
              <span
                className={`inline-block min-w-[1.5em] px-2 py-0.5 rounded-full text-xs font-semibold ml-1 transition-colors duration-200 ease-in-out ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "expenses" && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ExpensesList expenses={expenses} />
            </motion.div>
          )}
          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <PaymentsList payments={payments} />
            </motion.div>
          )}
          {activeTab === "balances" && (
            <motion.div
              key="balances"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <BalancesSummary balances={balances} settlements={settlements} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            key="add-expense"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <AddExpenseForm
              groupId={groupId}
              members={group.members}
              onClose={() => setShowAddExpense(false)}
            />
          </motion.div>
        )}
        {showAddPayment && (
          <motion.div
            key="add-payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <AddPaymentForm
              groupId={groupId}
              members={group.members}
              onClose={() => setShowAddPayment(false)}
            />
          </motion.div>
        )}
        {showInviteMember && (
          <motion.div
            key="invite-member"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <InviteMemberForm
              groupId={groupId}
              onClose={() => setShowInviteMember(false)}
            />
          </motion.div>
        )}
        {showGroupSettings && (
          <motion.div
            key="group-settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <GroupSettings
              groupId={groupId}
              onClose={() => setShowGroupSettings(false)}
              onGroupDeleted={onBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
