# BloodLink - Blood Donation Application

## 📌 Project Overview
BloodLink is a comprehensive blood donation platform built with the MERN stack that connects donors with recipients in need. The application facilitates seamless blood donation requests, donor management, and emergency coordination.

## 🚀 Live Demo
- **Frontend:** https://bloodlink.netlify.app
- **Backend:** https://bloodlink-api.onrender.com

## 🔐 Admin Credentials
- **Email:** admin@bloodlink.com
- **Password:** Admin@123

## 🛠️ Tech Stack
**Frontend:**
- React.js
- Tailwind CSS + DaisyUI
- React Router DOM
- Axios
- React Icons
- React Hot Toast

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- Multer for file uploads

## 📋 Key Features
- **Multi-role System:** Admin, Donor, Volunteer
- **User Registration:** With ImageBB avatar upload
- **Blood Donation Requests:** Create, view, manage
- **Donor Search:** Filter by blood group, district, upazila
- **Real-time Status Updates:** Pending → In Progress → Done/Canceled
- **Admin Dashboard:** User management, statistics
- **Funding System:** Stripe payment integration
- **JWT Authentication:** Secure API endpoints
- **Responsive Design:** Mobile-first approach

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/blood-donation-app.git

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Setup environment variables
cp .env.example .env.local









# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
