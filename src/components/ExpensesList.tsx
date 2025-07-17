import { motion, AnimatePresence } from "framer-motion";

interface Expense {
  _id: string;
  description: string;
  amount: number;
  payerName: string;
  date: number;
  createdAt: number;
  creatorName: string;
}

interface ExpensesListProps {
  expenses: Expense[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (expenses.length === 0) {
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
          <div className="text-gray-400 text-lg mb-4">No expenses yet</div>
          <p className="text-gray-600">
            Add your first expense to get started!
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {expenses.map((expense, i) => (
          <motion.div
            key={expense._id}
            className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeInOut" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {expense.description}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Paid by {expense.payerName} on{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </p>
                {expense.creatorName !== expense.payerName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Added by {expense.creatorName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
