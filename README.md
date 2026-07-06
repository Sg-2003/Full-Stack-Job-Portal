# Full-Stack Job Portal (MERN Stack)

A clean, premium, and fully-featured Job Portal application built using the MERN (MongoDB, Express.js, React, Node.js) stack. The platform handles end-to-end recruitment pipelines for both recruiters (posting, managing jobs, editing listings, tracking applicants, accepting/rejecting candidates) and job seekers (browsing jobs, dynamic search filtering, profile resume uploads, viewing application status).

## 🚀 Key Features

### 🧑‍💼 Recruiter Admin Dashboard
* **Dynamic Job Posting**: Create new jobs using a rich Quill.js text editor for detailed descriptions.
* **Manage Listings**: Edit details of existing jobs, toggle visibility on/off immediately via checkboxes, and delete postings.
* **Applicant Tracking**: View a comprehensive list of all applications across all jobs. View candidate names, and download uploaded resume PDFs directly.
* **Status Action Dropdowns**: Accept, reject, or keep applications pending via color-coded select dropdowns that sync with the backend instantly.

### 👤 Candidate Dashboard
* **Search & Filter**: Search jobs dynamically by title and location using custom API filters.
* **Resume Center**: Upload resume files directly using `multer` static hosting. Toggle resume/no-resume radio buttons, and view or change current resumes.
* **Application Tracker**: Monitor the real-time status (Pending 🟡, Accepted 🟢, Rejected 🔴) of all submitted job applications.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), React Router DOM, Axios, Quill.js
* **Backend**: Node.js, Express.js, JWT, Multer
* **Database**: MongoDB (Mongoose)
* **Styling**: Pure CSS (Modern Design Tokens, Glassmorphism, and responsive tables)

---

## 💻 Getting Started

### Prerequisites
* Node.js installed locally
* MongoDB database instance running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sg-2003/Full-Stack-Job-Portal.git
   cd Full-Stack-Job-Portal
   ```

2. **Setup Server**:
   ```bash
   cd server
   # Create a .env file containing:
   # PORT=5000
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret_phrase
   
   npm install
   npm run seed # Populate database with sample jobs, users, and applications
   npm run dev  # Starts Express server on http://localhost:5000
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   npm run dev # Starts Vite server on http://localhost:5173
   ```
