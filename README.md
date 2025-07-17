# 🚀 Workflow-Pro – Team Collaboration and Project Management Platform

**Workflow-Pro** is a powerful, intuitive web-based platform designed to help teams plan, organize, and execute their work efficiently. With features like Kanban boards, team and project management, task assignment, and email-based invitations, Workflow-Pro streamlines your entire workflow in a beautifully designed UI.

---

## ✅ Features

### 🧑‍💼 Team & Member Management

- Create teams and manage multiple members
- Send **email invitations** to onboard teammates
- Role-based access and permissions (coming soon)

### 📁 Project Management

- Create and manage projects within each team
- Organize tasks by status, deadline, and assignee

### 🗂️ Kanban Board

- Drag-and-drop task cards across **To Do**, **In Progress**, and **Done** columns
- Edit task titles, descriptions, and due dates
- Assign tasks to individual team members

### 🔐 Secure Authentication

- Sign up/login with email and password via **Firebase Authentication**
- Session management with protected routes

### 📬 Email Invitations

- Easily invite team members to join via their email
- Accept invite links and automatically join the right team
- Email backend powered by Node.js and nodemailer

### 📆 Google Calendar Integration

- Sync task deadlines with your calendar
- Get reminders and see events in your project timeline

### 🔗 GitHub Integration

- Connect personal or organization GitHub accounts
- Link GitHub **commits**, **issues**, and **pull requests** to Workflow-Pro tasks
- View GitHub activity inside your project dashboard
- Helps developers stay in sync between code and project management

---

## 🧱 Tech Stack

| Layer              | Technologies                                     |
| ------------------ |--------------------------------------------------|
| **Frontend**       | React.js, Tailwind CSS, React Router, ShadCN UI  |
| **Backend**        | Node.js, Express.js                              |
| **Auth**           | Firebase Authentication                          |
| **Database**       | Firebase Firestore                               |
| **Email System**   | Nodemailer or SendGrid (custom Node endpoint)    |
| **Calendar (WIP)** | GitHub API (OAuth + Webhooks), Google Calendar API                              |

---

## ⚙️ How It Works

1. **User Signs Up / Logs In**
   - Secure Firebase-based auth system.

2. **Create Teams & Projects**
   - Users can create or join teams, then start organizing work into projects.

3. **Invite Members**
   - Team leads can send email invites that link users directly to the right team.

4. **Manage Tasks via Kanban**
   - Drag, drop, assign, and update task cards in a familiar Kanban interface.

5. **View Dashboard**
   - See upcoming tasks, deadlines, team members, and project overviews.


---

## 🛠️ Installation

### Prerequisites

- Node.js v18+
- Firebase Project (for Auth and Firestore)
- Google Cloud Project (for Calendar Integration – optional)
- Nodemailer or SendGrid for sending emails

### 🔧 Backend Setup

```bash
git clone https://github.com/your-username/workflow-pro.git
cd workflow-pro/server
npm install
# Create a .env file with Firebase and email credentials
npm run dev
