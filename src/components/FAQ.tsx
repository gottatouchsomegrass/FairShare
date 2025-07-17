export function FAQ({ onClose }: { onClose: () => void }) {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first group?",
          answer:
            "Click the 'Create Group' button on your dashboard, enter a group name and optional description, then click 'Create Group'. You'll automatically be added as the first member.",
        },
        {
          question: "How do I invite someone to my group?",
          answer:
            "Click 'Invite Member' in your group, then enter your friend's User ID (which they can find and copy from their profile page). Invitations are no longer sent by email.",
        },
        {
          question: "Can I join multiple groups?",
          answer:
            "Yes! You can be a member of unlimited groups and easily switch between them from your dashboard.",
        },
      ],
    },
    {
      category: "Managing Expenses",
      questions: [
        {
          question: "How do I add an expense?",
          answer:
            "In your group, click 'Add Expense', fill in the description, amount, who paid, and the date. The expense will be automatically split equally among all group members.",
        },
        {
          question: "Can I edit or delete expenses?",
          answer:
            "Currently, expenses cannot be edited or deleted once added. This feature is planned for a future update. For now, you can add a correcting payment if needed.",
        },
        {
          question: "How are expenses split?",
          answer:
            "All expenses are split equally among all group members. Custom split options (by percentage or specific amounts) are planned for future updates.",
        },
      ],
    },
    {
      category: "Payments & Balances",
      questions: [
        {
          question: "How do I record a payment?",
          answer:
            "Click 'Record Payment' in your group, select who paid whom, enter the amount and optional description. This helps settle debts between members.",
        },
        {
          question: "How are balances calculated?",
          answer:
            "Balances show how much each person has paid vs. their share of expenses, plus any payments made or received. Positive balances mean they're owed money, negative means they owe money.",
        },
        {
          question: "What are suggested settlements?",
          answer:
            "The app automatically calculates the minimum number of payments needed to settle all debts in the group, showing who should pay whom and how much.",
        },
      ],
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          question: "How do I change my display name?",
          answer:
            "Click your profile icon, go to 'User Profile', and update your display name in the Profile Information tab.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Email addresses cannot be changed currently. Contact support if you need to update your email address.",
        },
        {
          question: "Who can see my expenses?",
          answer:
            "Only members of the same group can see expenses and payments within that group. Your information is not shared across different groups.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "I can't see a group I was invited to",
          answer:
            "Check your pending invitations on the dashboard. You need to accept the invitation before you can access the group.",
        },
        {
          question: "The balances don't look right",
          answer:
            "Balances are calculated in real-time based on expenses and payments. Make sure all expenses and payments have been recorded correctly.",
        },
        {
          question: "I accidentally recorded a wrong payment",
          answer:
            "Currently, payments cannot be deleted. You can record a reverse payment to cancel it out, or contact the group admin to help resolve the issue.",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Still have questions?
            </h3>
            <p className="text-blue-800 dark:text-blue-100 text-sm">
              If you can't find the answer you're looking for, feel free to
              reach out to our support team. We're here to help make your
              expense splitting experience as smooth as possible!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
