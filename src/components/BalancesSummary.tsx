import { motion, AnimatePresence } from "framer-motion";

interface Balance {
  userId: string;
  name: string;
  email?: string;
  totalPaid: number;
  shareOfExpenses: number;
  paymentsMade: number;
  paymentsReceived: number;
  netBalance: number;
}

interface Settlement {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

interface BalancesSummaryProps {
  balances: Balance[];
  settlements: Settlement[];
}

export function BalancesSummary({
  balances,
  settlements,
}: BalancesSummaryProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="space-y-6">
      {/* Balances */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Member Balances
        </h3>
        <div className="space-y-3">
          <AnimatePresence>
            {balances.map((balance, i) => (
              <motion.div
                key={balance.userId}
                className="bg-white p-4 rounded-lg shadow-sm border"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {balance.name}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                      <p>Total paid: {formatCurrency(balance.totalPaid)}</p>
                      <p>
                        Share of expenses:{" "}
                        {formatCurrency(balance.shareOfExpenses)}
                      </p>
                      <p>
                        Payments made: {formatCurrency(balance.paymentsMade)}
                      </p>
                      <p>
                        Payments received:{" "}
                        {formatCurrency(balance.paymentsReceived)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        balance.netBalance > 0
                          ? "text-green-600 dark:text-green-400"
                          : balance.netBalance < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {balance.netBalance > 0 ? "+" : ""}
                      {formatCurrency(balance.netBalance)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {balance.netBalance > 0
                        ? "Owed to them"
                        : balance.netBalance < 0
                          ? "They owe"
                          : "Settled"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Suggested Settlements */}
      <AnimatePresence mode="wait">
        {settlements.length > 0 && (
          <motion.div
            key="settlements"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Suggested Settlements
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                To settle all debts, record these payments:
              </p>
              <div className="space-y-2">
                {settlements.map((settlement, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-3 rounded border"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        <strong>{settlement.fromUserName}</strong> should pay{" "}
                        <strong>{settlement.toUserName}</strong>
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(settlement.amount)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {settlements.length === 0 && (
          <motion.div
            key="all-settled"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-lg p-4"
          >
            <p className="text-green-800 dark:text-green-200 font-medium text-lg flex items-center gap-2">
              <span role="img" aria-label="party">
                🎉
              </span>{" "}
              All settled up!
            </p>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              Everyone's balances are even. No payments needed.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
