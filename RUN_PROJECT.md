# ▶️ Run Project Guide

This guide explains how to **set up and run the Production Management System** on your local machine.

---

## 🧰 Prerequisites

Make sure you have the following installed:

- Node.js (v16+ recommended)
- npm
- MySQL Server (or XAMPP/WAMP)
- phpMyAdmin (optional but recommended)

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/your-username/production-management-system.git
cd production-management-system
🗄️ 2. Setup Database
Step 1: Create Database

Open phpMyAdmin and create a new database:

outstaff_db
Step 2: Import Database File
Open phpMyAdmin
Select database → outstaff_db
Click on Import
Choose the file:
outstaff_db.sql
Click Go
📌 Database Tables Included
admins
users
employee_master
vendor_table
vendor_contractor_master
item_master
item_group_master
item_process_master
production_table
menu_permissions
logs
department_table
designation_table
⚙️ 3. Backend Setup
cd backend
npm install
Create .env file in backend:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=outstaff_db
▶️ Run Backend Server
node server.js

Server will run on:

http://localhost:5000
💻 4. Frontend Setup
cd outstaff-app
npm install
npm run dev

Frontend will run on:

http://localhost:5173
🔑 Default Login (if seeded in DB)

You can use:

Admin:
Email: admin@gmail.com
Password: admin123

(Change based on your database data)

📂 Upload Folder (Important)

Make sure this folder exists:

backend/uploads/

Used for:

Excel/CSV uploads
⚠️ Common Issues & Fixes
1. CORS Error
Ensure backend is running
Check API base URL in frontend config
2. Database Connection Error
Verify .env credentials
Ensure MySQL is running
3. Port Already in Use

Change port in .env:

PORT=5001
🚀 You're Ready!

Now open:

http://localhost:5173

and start using the app 🎉