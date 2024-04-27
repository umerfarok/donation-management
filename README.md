# Donation Management Application

This is a full-stack web application built with React.js and Node.js for managing donations and users for a Masjid (mosque). It allows administrators to add, edit, and delete donation users, manage user approvals, and send email reminders to users who haven't donated.

## Features

- **User Authentication**: Users can register and log in to access the application.
- **Donation User Management**: Administrators can add, edit, and delete donation users.
- **User Approval**: Administrators can approve or disapprove users.
- **Email Reminders**: Automated email reminders can be sent to users who haven't donated for a certain period.
- **Dashboard**: Administrators can view and manage all registered users and their donations.
- **User Registration**: Users can register with their name, email, password, team name, and donation amount.

## Technologies Used

- **Front-end**: React.js, Material-UI
- **Back-end**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)
- MongoDB (or a MongoDB Atlas cluster)

### Installation

1. Clone the repository:

3. Install client dependencies:
4. npm install
4. Create a `.env` file in the `server` directory and add the following environment variables:
5. The application should now be running at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).