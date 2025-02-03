# Secure and Interactive Web Application

## Overview

This project is a secure and interactive web application built using **EJS**, **MongoDB Atlas**, and **local authentication techniques**. It includes features such as user authentication, session management, password hashing, and additional functionalities like **email password reset** and **profile picture upload**.

## Features

- **MongoDB Atlas Integration**:

  - Cloud-hosted database using MongoDB Atlas.
  - Secure database connection via environment variables.
  - Implements CRUD operations.

- **User Authentication & Security**:

  - Registration and login system.
  - Password hashing with bcrypt.
  - Session-based authentication using `express-session`.
  - Access control for authenticated users.

- **User Experience & Styling**:

  - Dynamic EJS templates for personalized user views.
  - Welcome message with the logged-in user's name.
  - Options to view, edit, and delete user data.

- **Deployment**:

  - Hosted on **Heroku** or another cloud platform.
  - Secure storage of environment variables.
  - Fully functional both locally and online.

- **Form Validation & Error Handling**:

  - Validates user inputs (e.g., required fields, password length).
  - Handles authentication errors gracefully.
  - Displays user-friendly error messages.

- **Additional Features**:

  - **Password Reset via Email**: Users can reset their password via email verification.
  - **Profile Picture Upload**: Users can upload and update their profile pictures.

## Installation & Setup

1. **Clone the Repository**

   ```sh
   git clonegit@github.com:barcek2281/assigment4.git
   cd assigment4
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Setup Environment Variables**

   - Create a `.env` file and add the following:
     ```sh
     MONGO_URI=<your_mongodb_atlas_connection_string>
     SESSION_SECRET=<your_session_secret>
     EMAIL_USER=<your_email_for_password_reset>
     EMAIL_PASS=<your_email_password>
     ```

4. **Run the Application Locally**

   ```sh
   npm start
   ```

   - Open `http://localhost:3000` in your browser.

5. **Deploy to Heroku**

   - Follow Heroku's deployment steps to push your project online.

## Usage Instructions

- **Sign up** for a new account.
- **Log in** to access the dashboard.
- **Upload a profile picture** from your account settings.
- **Reset your password** using email verification if needed.

## Evaluation Criteria

| Criteria                  | Description                                      | Weight |
| ------------------------- | ------------------------------------------------ | ------ |
| MongoDB Atlas Integration | Secure connection & CRUD operations              | 10%    |
| Authentication & Security | Secure login/logout, session management          | 30%    |
| Styling                   | User-friendly UI with EJS templates              | 10%    |
| Deployment                | Hosted online & accessible                       | 15%    |
| Additional Features       | Implemented email reset & profile picture upload | 15%    |
| Presentation & Defense    | Clear explanation & project demonstration        | 20%    |

## Contact

For any issues or inquiries, feel free to reach out: 📧 Email: [sabdpp17@gmail.com](mailto\:sabdpp17@gmail.com)

---

This project is developed as part of **Assignment 4: Secure and Interactive Exploration with EJS and MongoDB Atlas**.

