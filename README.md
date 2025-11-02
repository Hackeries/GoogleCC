
# **GCC – Smart Calendar & Meeting Manager (Calendly + Google Calendar Clone)**

> A **fullstack calendar scheduling app** built with **Node.js, PostgreSQL, TypeORM, and React.js**, designed to make meeting scheduling effortless, automated, and intelligent.

---

## **Overview**

Welcome to **GCC (Google Calendar Clone)** — the smartest way to **book, manage, and track your meetings**.
It’s a high-fidelity **Calendly-inspired platform** that lets users create personalized booking pages, sync with Google Calendar, and manage events with full flexibility.

This project was built **from scratch**, integrating **modern UI**, **backend APIs**, and **Google Meet support** — combining both design and functionality.

---

## **Key Features**

### Authentication & User Management

* Secure **JWT-based Sign-In / Sign-Up**
* Role-based access and session handling
* Integrated **Supabase (PostgreSQL)** for scalable data storage

### Event Management

* Create & edit **event types (public/private)**
* Generate **unique booking links** for clients
* Automatic **Google Meet link creation**
* Manage **upcoming, past, and canceled meetings**

### Availability & Scheduling

* Define custom **availability windows**
* Prevent **double-booking** intelligently
* Real-time **time zone detection**
* Toggle between **12-hour and 24-hour formats**

### Integrations

* **Google Calendar & Meet Integration** (via Google API)
* Seamless syncing between **GCC** and Google Calendar
* Support for future **Microsoft & Zoom** integrations

### UI & UX

* Built from scratch — **no third-party calendar plugins**
* **Responsive Design** powered by **Tailwind CSS v4** & **Shadcn UI**
* Fast, clean, and elegant **frontend using React + TypeScript**
* Custom **Calendar Component** built for complete flexibility

---

## **Tech Stack**

| Category           | Technologies Used                                     |
| ------------------ | ----------------------------------------------------- |
| **Frontend**       | React.js, TypeScript, Vite.js, TailwindCSS, Shadcn UI |
| **Backend**        | Node.js, Express.js, TypeORM                          |
| **Database**       | PostgreSQL (via Supabase)                             |
| **Authentication** | JWT (JSON Web Tokens)                                 |
| **Integrations**   | Google Calendar API, Google OAuth2                    |
| **Deployment**     | Render / Vercel / Supabase Hosting                    |

---

## **Project Structure**

```
GCC/
│
├── backend/
│   ├── src/
│   │   ├── entities/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── dtos/
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── hooks/
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## **Environment Variables Setup**

Create a `.env` file in the **backend root** and include:

```bash
PORT=8000
NODE_ENV=development

DATABASE_URL="postgresql://postgres.<user>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1d"

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI="http://localhost:8000/api/integration/google/callback"

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_INTEGRATION_URL="http://localhost:5173/app/integrations"
```

---

##  **Running the Application (Locally)**

### Backend

```bash
cd backend
npm install
npm run dev
```

 The backend will run at **[http://localhost:8000](http://localhost:8000)**

###  Frontend

```bash
cd frontend
npm install
npm run dev
```

 The frontend will run at **[http://localhost:5173](http://localhost:5173)**

---

##  **Deployment**

###  Deploying to Render / Vercel

1. Add the same `.env` variables to your hosting environment.
2. Deploy backend (Node.js) on **Render**.
3. Deploy frontend (React) on **Vercel**.
4. Make sure `FRONTEND_ORIGIN` and `BACKEND_URL` are updated in both environments.

---

##  **Modules in GCC**

| Module                | Description                               |
| --------------------- | ----------------------------------------- |
| **Authentication**    | Secure JWT-based auth with refresh tokens |
| **Event Management**  | Create, view, and delete events           |
| **Calendar View**     | Custom-built React calendar (no plugins)  |
| **Availability**      | Define available hours and manage slots   |
| **Integrations**      | Sync Google Meet / Calendar               |
| **Meeting Scheduler** | Book meetings instantly with dynamic URLs |

---

## **Contributors**

* **Aviral Joshi** — Fullstack Developer, Designer, and Project Creator
   *Building productivity apps with love and logic.*

---

##  **Future Enhancements**

*  Add Outlook & Zoom integrations
*  Mobile-friendly PWA version
*  Dashboard analytics for event insights
*  Real-time notifications with Supabase channels

