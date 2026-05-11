# 📚 BokDags

BokDags är en modern bokplattform byggd med HTML, CSS, JavaScript och Strapi CMS.

Användare kan:

* skapa konto och logga in
* bläddra bland böcker
* spara böcker till sin profil
* betygsätta böcker
* se genomsnittliga betyg
* använda olika teman

Projektet är deployat med:

* Frontend: Vercel
* Backend/CMS: Strapi Cloud

---

# 🌐 Live Demo

Frontend:

`https://bok-dags.vercel.app`

Backend:

`https://artistic-hero-019f59ea0e.strapiapp.com/admin`

---

# ✨ Funktioner

## 👤 Autentisering

* Registrering
* Inloggning
* JWT-baserad autentisering via Strapi
* Skyddad admin-sida

## 📚 Böcker

* Visa alla böcker
* Sök efter titel eller författare
* Sortera efter:

  * senaste
  * högst betyg
* Modal för bokdetaljer

## ⭐ Betygssystem

* Användare kan ge böcker betyg mellan 1–10
* Genomsnittligt betyg visas för varje bok
* Uppdateras dynamiskt från backend

## 💾 Sparade böcker

* Spara böcker till “Att läsa”
* Personlig profilsida
* Visa sparade böcker och tidigare betyg

## 🎨 Teman

Tre olika teman:

* Light
* Ocean
* Nature

Teman kan ändras av admin.

## 🛠 Adminfunktioner

Admin kan:

* lägga till böcker
* ladda upp bokomslag
* hantera innehåll via Strapi CMS

---

# 🧱 Teknologier

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

# 📂 Projektstruktur

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

# ⚙️ Installation lokalt

## 1. Klona repot

```bash
git clone https://github.com/ditt-användarnamn/bokdags.git
```

---

## 2. Starta frontend

Öppna frontend-mappen i VS Code och använd exempelvis Live Server.

---

## 3. Starta backend

Gå till backend-mappen:

```bash
cd backend
```

Installera dependencies:

```bash
npm install
```

Starta Strapi:

```bash
npm run develop
```

---

# 🔐 Environment Variables

Backend använder följande environment variables:

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

Deployad med Vercel.

## Backend

Deployad med Strapi Cloud.

---

# 👩‍💻 Skapad av

Victoria Friberg

2026
