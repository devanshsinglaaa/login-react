# 🚀 Production Management System (Full Stack)

> A modern, scalable **Production & Workforce Management System** built using **React (Vite), Node.js, Express, and MySQL** with role-based access control and analytics dashboard.

---

## Live Pictures (UI)
![LOGIN_REACT_IMG](/screenshots/ls_01.png)

![LOGIN_REACT_IMG](/screenshots/ls_02.png)

![LOGIN_REACT_IMG](/screenshots/ls_03.png)

![LOGIN_REACT_IMG](/screenshots/ls_04.png)

![LOGIN_REACT_IMG](/screenshots/ls_05.png)

![LOGIN_REACT_IMG](/screenshots/ls_06.png)

![LOGIN_REACT_IMG](/screenshots/ls_07.png)

![LOGIN_REACT_IMG](/screenshots/ls_08.png)

![LOGIN_REACT_IMG](/screenshots/ls_09.png)

![LOGIN_REACT_IMG](/screenshots/ls_10.png)

![LOGIN_REACT_IMG](/screenshots/ls_11.png)

![LOGIN_REACT_IMG](/screenshots/ls_12.png)

![LOGIN_REACT_IMG](/screenshots/ls_13.png)

![LOGIN_REACT_IMG](/screenshots/ls_14.png)

![LOGIN_REACT_IMG](/screenshots/ls_15.png)

![LOGIN_REACT_IMG](/screenshots/ls_16.png)

![LOGIN_REACT_IMG](/screenshots/ls_17.png)

![LOGIN_REACT_IMG](/screenshots/ls_18.png)

![LOGIN_REACT_IMG](/screenshots/ls_19.png)

![LOGIN_REACT_IMG](/screenshots/ls_20.png)

![LOGIN_REACT_IMG](/screenshots/ls_21.png)

## ✨ Live Features

🔐 **Authentication & Authorization**
- Role-based access (Admin / User)
- Permission system (Add, Edit, Delete, View, Print)
- Session timeout handling

📊 **Smart Dashboard**
- Production analytics
- Revenue insights
- Employee & Vendor stats
- Graphs & charts (visual insights)

📦 **Production Management**
- Daily production entry
- Edit/Delete production
- Bulk upload via Excel/CSV

👨‍💼 **Master Management**
- Employee Master
- Vendor / Contractor Master
- Item Master
- Group Master
- Product Process Management

📈 **Advanced Reports**
- Item Wise Report
- Employee Wise Report
- Vendor Wise Report
- Salary Report
- Export to Excel

🛠 **Admin Controls**
- Manage Users
- Assign granular permissions
- View login activity logs

---

## 🧠 Tech Stack

### 💻 Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios

### ⚙️ Backend
- Node.js
- Express.js

### 🗄 Database
- MySQL

---

## 📁 Project Structure


LOGIN_REACT/
│
├── backend/
│ ├── uploads/
│ ├── server.js
│ ├── package.json
│
├── outstaff-app/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── config/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ ├── index.css
│ │
│ ├── index.html
│ ├── package.json
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/production-management-system.git
cd production-management-system
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=outstaff_db

Run backend:

node server.js
3️⃣ Frontend Setup
cd outstaff-app
npm install
npm run dev

Open:

http://localhost:5173
📊 Excel Upload Format
employee_code,item_code,qty
EMP001,1001,25
EMP002,1002,30
🔥 Key Highlights
Clean modern UI with Tailwind
Fully modular architecture
Scalable backend structure
Real-world business use case
Admin + User separation
Optimized data handling
🚀 Future Improvements
JWT Authentication
Pagination & Server-side filtering
Docker Deployment
AWS EC2 + Nginx Hosting
Real-time updates (WebSockets)
👨‍💻 Author

Devansh Singla

💼 Full Stack Developer (MERN)
🎨 UI/UX Enthusiast
🚀 Passionate about real-world scalable systems
⭐ Show Your Support

If you like this project:

👉 Star this repository
👉 Share it on LinkedIn
👉 Use it in your portfolio

📬 +91-9877817998
📧 devanshsinglaa@gmail.com
💼 LinkedIn: (https://www.linkedin.com/in/devansh-singla/)



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
