# FairShare – Group Shared Expenses App

FairShare is a modern web application for managing and splitting group expenses, inspired by Splitwise. Built with [Convex](https://convex.dev) for the backend and [Vite](https://vitejs.dev/) for the frontend, FairShare makes it easy for friends, roommates, or teams to track shared costs and settle up effortlessly.

## Features

- **Group Management:** Create and manage groups for different events or purposes.
- **Expense Tracking:** Add, edit, and view shared expenses within groups.
- **Payments:** Record payments and see who owes whom.
- **Balances Summary:** Instantly view how much each member owes or is owed.
- **Invitations:** Invite members to join groups via email.
- **Authentication:** Secure sign-in with password and anonymous options (Convex Auth).
- **Modern UI:** Clean, responsive interface for desktop and mobile.

## Project Structure

- **Frontend:** `src/` – React components, pages, and styles.
- **Backend:** `convex/` – Convex functions, schema, and authentication logic.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Convex deployment URL and any other required values.
3. **Run the app locally:**
   ```sh
   npm run dev
   ```
   This starts both the frontend and backend servers.

## Authentication

FairShare uses [Convex Auth](https://auth.convex.dev/) for authentication. By default, anonymous and password-based sign-in are enabled for easy access. You can customize authentication providers as needed.

## Deployment

- The app is connected to the Convex deployment [`resilient-marten-503`](https://dashboard.convex.dev/d/resilient-marten-503).
- For deployment instructions, see the [Convex Hosting and Deployment docs](https://docs.convex.dev/production/).

## HTTP API

Custom HTTP routes are defined in `convex/router.ts`.

## Future Plans

- **Theme Support:** Light and dark mode toggle, with more themes planned.
- **Mobile App:** Native mobile experience for iOS and Android.
- **More Auth Providers:** Google, GitHub, and other OAuth options.
- **Notifications:** Email and in-app notifications for expenses and payments.
- **Advanced Analytics:** Visualize spending trends and group statistics.
- **Internationalization:** Multi-language support.
- **Enhanced Security:** 2FA and improved access controls.

## Contributing

Contributions are welcome! Please open issues or pull requests for suggestions, bug fixes, or new features.

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Inviting Members

To invite someone to your group, click the 'Invite Member' button and enter their User ID (which they can find and copy from their profile page). Invitations are no longer sent by email.

---

FairShare – Making group expenses fair and simple.
