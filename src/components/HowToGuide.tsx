import { useState } from "react";

export function HowToGuide({ onClose }: { onClose: () => void }) {
  const [activeGuide, setActiveGuide] = useState<string>("getting-started");

  const guides = {
    "getting-started": {
      title: "Getting Started with FairShare",
      steps: [
        {
          title: "Create Your Account",
          content:
            "Sign up with your email and password to get started. Your account will be created automatically when you first sign in.",
          tips: [
            "Use a valid email address as this will be used for group invitations",
            "Choose a display name that your friends will recognize",
          ],
        },
        {
          title: "Create Your First Group",
          content:
            "Click the 'Create Group' button on your dashboard. Give your group a descriptive name like 'Roommates' or 'Paris Trip 2024'.",
          tips: [
            "Add a description to help members understand what the group is for",
            "You'll automatically be added as the first member",
          ],
        },
        {
          title: "Invite Friends",
          content:
            "Use the 'Invite Member' button in your group to add friends by their User ID. Ask your friend for their User ID (see their profile page) and enter it in the invite form.",
          tips: [
            "Friends need to accept the invitation before they can participate",
            "Check the Members section to see who has joined",
            "User IDs can be copied from the profile page for easy sharing",
          ],
        },
      ],
    },
    "adding-expenses": {
      title: "Adding and Managing Expenses",
      steps: [
        {
          title: "Add an Expense",
          content:
            "Click 'Add Expense' in your group. Fill in what was purchased, how much it cost, who paid, and when.",
          tips: [
            "Be descriptive in your expense descriptions",
            "Double-check the amount before submitting",
            "The expense will be split equally among all members",
          ],
        },
        {
          title: "Choose Who Paid",
          content:
            "Select from the dropdown which group member actually paid for the expense. This affects the balance calculations.",
          tips: [
            "Only group members can be selected as payers",
            "Make sure to select the correct person who paid",
          ],
        },
        {
          title: "Review Your Expenses",
          content:
            "View all group expenses in the Expenses tab. You can see who paid, when, and who added each expense.",
          tips: [
            "Expenses are sorted by date (newest first)",
            "The creator of an expense is shown if different from the payer",
          ],
        },
      ],
    },
    "recording-payments": {
      title: "Recording Payments Between Members",
      steps: [
        {
          title: "When to Record Payments",
          content:
            "Record a payment when one member pays another to settle their debts. This is separate from expenses and helps balance accounts.",
          tips: [
            "Use payments to settle up between members",
            "Don't record the original expense as a payment",
          ],
        },
        {
          title: "Record a Payment",
          content:
            "Click 'Record Payment', select who paid whom, enter the amount, and add an optional description.",
          tips: [
            "You cannot record a payment from someone to themselves",
            "Add descriptions like 'Settling dinner bill' for clarity",
          ],
        },
        {
          title: "View Payment History",
          content:
            "Check the Payments tab to see all recorded payments between group members.",
          tips: [
            "Payments are shown in green to distinguish from expenses",
            "You can see who recorded each payment",
          ],
        },
      ],
    },
    "understanding-balances": {
      title: "Understanding Balances and Settlements",
      steps: [
        {
          title: "How Balances Work",
          content:
            "Balances show how much each person has paid versus their fair share of all expenses, adjusted for any payments made or received.",
          tips: [
            "Positive balance = they are owed money",
            "Negative balance = they owe money",
            "Zero balance = they're settled up",
          ],
        },
        {
          title: "Reading the Balance Details",
          content:
            "Each member's balance shows their total paid, their share of expenses, payments made, and payments received.",
          tips: [
            "Total paid = all expenses they've covered",
            "Share of expenses = their portion of all group expenses",
            "Net balance considers all factors",
          ],
        },
        {
          title: "Using Suggested Settlements",
          content:
            "The app calculates the minimum payments needed to settle all debts and shows exactly who should pay whom.",
          tips: [
            "Follow the suggestions to minimize the number of transactions",
            "Record these payments once they're made in real life",
          ],
        },
      ],
    },
    "group-management": {
      title: "Managing Your Groups",
      steps: [
        {
          title: "Group Settings",
          content:
            "Access group settings to edit the group name, description, manage members, or delete the group entirely.",
          tips: [
            "Only group creators can delete groups",
            "Removing members will affect balance calculations",
            "Be careful with the delete option - it's permanent",
          ],
        },
        {
          title: "Managing Members",
          content:
            "View all group members, see when they joined, and remove members if needed.",
          tips: [
            "Removed members lose access to the group immediately",
            "Their past expenses and payments remain in the history",
          ],
        },
        {
          title: "Group Invitations",
          content:
            "Pending invitations appear on your dashboard. Accept or decline invitations to join new groups.",
          tips: [
            "You'll get notifications for new invitations",
            "Declining an invitation removes it permanently",
          ],
        },
      ],
    },
  };

  const guideOptions = [
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "adding-expenses", title: "Adding Expenses", icon: "💰" },
    { id: "recording-payments", title: "Recording Payments", icon: "💳" },
    {
      id: "understanding-balances",
      title: "Understanding Balances",
      icon: "⚖️",
    },
    { id: "group-management", title: "Managing Groups", icon: "👥" },
  ];

  const currentGuide = guides[activeGuide as keyof typeof guides];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-50 dark:bg-zinc-800 p-6 border-r border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                How-To Guides
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <nav className="space-y-2">
              {guideOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveGuide(option.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeGuide === option.id
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span className="mr-3">{option.icon}</span>
                  {option.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {currentGuide.title}
            </h3>

            <div className="space-y-8">
              {currentGuide.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {step.content}
                      </p>

                      {step.tips && step.tips.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 mb-2">
                            💡 Pro Tips:
                          </h5>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li
                                key={tipIndex}
                                className="text-blue-800 text-sm"
                              >
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {index < currentGuide.steps.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-8 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                🎉 You're all set!
              </h4>
              <p className="text-green-800 dark:text-green-100 text-sm">
                Follow these steps and you'll be splitting expenses like a pro.
                Remember, you can always come back to these guides anytime you
                need a refresher.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
