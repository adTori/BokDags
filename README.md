# 📚 BokDags

BokDags is a modern book platform built with HTML, CSS, JavaScript, and Strapi CMS.

Users can:

* create accounts and log in
* browse books
* save books to their profile
* rate books
* view average ratings
* switch between different themes

The project is deployed with:

* Frontend: Vercel
* Backend/CMS: Strapi Cloud

---

# 🌐 Live Demo

Frontend:

`https://bok-dags.vercel.app`

Backend:

`https://artistic-hero-019f59ea0e.strapiapp.com/admin`

---

# ✨ Features

## 👤 Authentication

* User registration
* Login system
* JWT-based authentication via Strapi
* Protected admin page

## 📚 Books

* Display all books
* Search by title or author
* Sort books by:

  * newest
  * highest rated
* Book detail modal

## ⭐ Rating System

* Users can rate books from 1–10
* Average ratings are displayed for every book
* Ratings update dynamically from the backend

## 💾 Saved Books

* Save books to a personal “Want to Read” list
* Personal profile page
* View saved books and previous ratings

## 🎨 Themes

Three different themes:

* Light
* Ocean
* Nature

Themes can be changed by the admin.

## 🛠 Admin Features

Admins can:

* add books
* upload book covers
* manage content through Strapi CMS

---

# 🧱 Technologies

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* Strapi CMS
* Strapi Cloud
* JWT Authentication

## Deployment

* Vercel
* Strapi Cloud
* GitHub

---

# 📂 Project Structure

```txt
bokdags/
│
├── frontend/
│   ├── index.html
│   ├── home.html
│   ├── profile.html
│   ├── admin.html
│   ├── style.css
│   ├── index.js
│   └── images/
│
├── backend/
│   ├── src/
│   ├── config/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# ⚙️ Local Installation

## 1. Clone the repository

```bash
git clone https://github.com/your-username/bokdags.git
```

---

## 2. Start the frontend

Open the frontend folder in VS Code and run it using Live Server or a similar extension.

---

## 3. Start the backend

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start Strapi:

```bash
npm run develop
```

---

# 🔐 Environment Variables

The backend uses the following environment variables:

```env
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
```

---

# 📸 Screenshots


<img width="1904" height="994" alt="Skärmbild 2026-05-09 141653" src="https://github.com/user-attachments/assets/afdcd819-fd22-4f73-b288-8327a2464df4" />
<img width="1902" height="994" alt="Skärmbild 2026-05-09 141714" src="https://github.com/user-attachments/assets/d660e480-7235-4a41-9ee0-a32d043bf9dc" />
<img width="1900" height="994" alt="Skärmbild 2026-05-09 141836" src="https://github.com/user-attachments/assets/99760d62-b8a3-4a9a-9cde-7fce100ee028" />
<img width="1906" height="997" alt="Skärmbild 2026-05-09 142003" src="https://github.com/user-attachments/assets/ecfa7f4e-6259-4b30-bd91-f3f8c21130ec" />
<img width="1901" height="996" alt="Skärmbild 2026-05-09 142051" src="https://github.com/user-attachments/assets/0d366784-b6bf-459d-8ab7-90b8333d8c7b" />
<img width="1903" height="995" alt="Skärmbild 2026-05-09 142119" src="https://github.com/user-attachments/assets/5940583a-197b-413d-bcdc-1ade1fb0b70a" />

---

# 🚀 Deployment

## Frontend

Deployed with Vercel.

## Backend

Deployed with Strapi Cloud.

---

# 👩‍💻 Created By

Victoria Friberg

2026
