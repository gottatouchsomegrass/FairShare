import { motion, AnimatePresence } from "framer-motion";

interface Payment {
  _id: string;
  fromUserName: string;
  toUserName: string;
  amount: number;
  description?: string;
  date: number;
  createdAt: number;
  creatorName: string;
}

interface PaymentsListProps {
  payments: Payment[];
}

export function PaymentsList({ payments }: PaymentsListProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (payments.length === 0) {
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
          <div className="text-gray-400 text-lg mb-4">No payments yet</div>
          <p className="text-gray-600">
            Record payments to settle debts between members!
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {payments.map((payment, i) => (
          <motion.div
            key={payment._id}
            className="bg-white p-4 rounded-lg shadow-sm border"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeInOut" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {payment.fromUserName} → {payment.toUserName}
                </h3>
                {payment.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.description}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Payment on {new Date(payment.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recorded by {payment.creatorName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
