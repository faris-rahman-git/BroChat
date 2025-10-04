# 💬 BroChat

**BroChat** is a **real-time chat application** built using the **MERN stack** with **TypeScript**.  
It allows users to send messages instantly, make audio/video calls, and access premium chat features through secure payments.  
This system is designed for smooth real-time communication with a modern UI and reliable backend services.

---

## 🚀 Features

- 💬 **Instant Messaging** – Real-time one-on-one and group chat using **Socket.IO**
- 📞 **Audio & Video Calls** – High-quality **WebRTC-based** calling system
- 👤 **Authentication** – Secure login using **JWT** and **Passport OAuth** (Google, GitHub, Facebook)
- 🪙 **Exclusive Membership** – Users can pay to become **Exclusive Users** for premium access
  - Paid chat access with creators or mentors
  - Razorpay payment gateway integration
  - Exclusive chat features for subscribed members
- ☁️ **File & Media Uploads** – Stored securely on **AWS S3**
- 🔒 **Security** – Rate limiting, helmet, and secure token handling
- 🧠 **Optimized State Handling** – **Redux Toolkit** + **TanStack Query** for caching and mutation
- 🧩 **Custom Plan System** – Creators can design and sell their own chat access plans
- ⚙️ **Performance Optimizations** – Redis caching for sessions and real-time data
- 🧾 **Email Notifications** – Using Nodemailer for communication and verification

---

## 🧰 Tech Stack

### **Frontend**

- React + TypeScript
- Redux Toolkit
- TanStack Query (React Query)
- Tailwind CSS + ShadCN/UI
- Axios
- WebRTC
- Socket.IO client
- Framer Motion (animations)

### **Backend**

- Express + ts-node
- MongoDB (Mongoose)
- Redis (cache management)
- AWS S3 (file storage)
- Razorpay (payment gateway)
- Passport (OAuth integrations)
- JWT Authentication
- Nodemailer
- Socket.IO server
- Helmet + Rate Limiting (security)

---

## 🌐 Live Demo

👉 [**https://www.brochat.shop/**](https://www.brochat.shop/)

---

## ⚙️ Project Setup

### 1. Clone Repository

```bash
git clone <your_repo_url>
cd brochat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

### i - Frontend .env

```bash
VITE_BASE_API=
VITE_SERVER_URL=
VITE_RAZORPAY_KEY=
```

### ii - Backend .env

```bash
MONGO_URI=
CLIENT_URL=http://localhost:4200

PORT=5000
NODEMAILER_EMAIL=
NODEMAILER_PASS=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_REGION=

RAZORPAY_KEY=
RAZORPAY_SECRET=

```

### 4. Setup Redis

- Ensure Redis is running locally or accessible remotely for caching and session management.
- (Example: use Docker or a managed Redis service.)

### 5. Run

### i - Frontend

```bash
npx nx serve client
```

### ii - Backend

```bash
npx nx serve server
```

- Visit http://localhost:4200 in your browser.

### 6. Build for Production

```bash
npx nx build client
npx nx build server
```

## 👨‍💻 Author

**Faris Rahman**  
🚀 Built with ❤️ using MERN + TypeScript  
🌐 [https://www.brochat.shop/](https://www.brochat.shop/)
