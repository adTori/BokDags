const API_URL = "http://localhost:1337";
const API = `${API_URL}/api`;

let books = [];
let savedBooks = [];
let userRatings = [];
let allRatings = [];
let profileSavedSort = "title";
let profileRatingSort = "rating";


let currentUser = JSON.parse(localStorage.getItem("user")) || null;
let token = localStorage.getItem("jwt") || null;
let currentSort = "new";

// ─────────────────────────────
// INIT
// ─────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  protectAdminPage();
  showAdminLink();
  setupLoginModal();
  setupNav();
  setupSearch();
  setupProfileSort();
  setupAdmin();
  applySavedTheme();

  renderUsername();

  await fetchBooks();

  if (currentUser) {
    await fetchSavedBooks();
    await fetchUserRatings();
  }
});

// ─────────────────────────────
// HELPERS
// ─────────────────────────────
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function showError(message) {
  alert(message);
}

function getCoverUrl(book) {
  if (book?.cover?.url) {
    return `${API_URL}${book.cover.url}`;
  }

  if (book?.cover?.data?.attributes?.url) {
    return `${API_URL}${book.cover.data.attributes.url}`;
  }

  return "";
}

function getAverageRating(book) {
  const bookRatings = allRatings.filter((rating) => {
    return rating.book?.documentId === book.documentId;
  });

  if (!bookRatings.length) return "Inget betyg";

  const total = bookRatings.reduce((sum, rating) => {
    return sum + Number(rating.score || 0);
  }, 0);

  return (total / bookRatings.length).toFixed(1);
}

// ─────────────────────────────
// LOGIN MODAL
// ─────────────────────────────
function setupLoginModal() {
  const openLogin = document.getElementById("openLogin");

  if (openLogin) {
    openLogin.addEventListener("click", () => {
      if (currentUser) {
        window.location.href = "home.html";
      } else {
        document.getElementById("overlay")?.classList.add("open");
      }
    });
  }
}

function switchTab(tab) {
  const isLogin = tab === "login";

  document.getElementById("panelLogin")?.classList.toggle("visible", isLogin);
  document.getElementById("panelRegister")?.classList.toggle("visible", !isLogin);

  document.getElementById("tabLogin")?.classList.toggle("active", isLogin);
  document.getElementById("tabRegister")?.classList.toggle("active", !isLogin);
}

// ─────────────────────────────
// AUTH
// ─────────────────────────────
async function handleLogin() {
  const identifier = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!identifier || !password) {
    showError("Fyll i e-post och lösenord.");
    return;
  }

  const res = await fetch(`${API}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    showError(data.error?.message || "Kunde inte logga in.");
    return;
  }

  saveLogin(data);
}

async function handleRegister() {
  const username = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();

  if (!username || !email || !password) {
    showError("Fyll i namn, e-post och lösenord.");
    return;
  }

  const res = await fetch(`${API}/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    showError(data.error?.message || "Kunde inte skapa konto.");
    return;
  }

  saveLogin(data);
}

async function saveLogin(data) {
  token = data.jwt;
  currentUser = data.user;

  localStorage.setItem("jwt", token);
  localStorage.setItem("user", JSON.stringify(currentUser));

  document.getElementById("overlay")?.classList.remove("open");

  setupNav();
  renderUsername();

  await fetchBooks();
  await fetchSavedBooks();
  await fetchUserRatings();

  if (currentUser.admin === true) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "home.html";
  }
}

function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");

  token = null;
  currentUser = null;

  window.location.href = "index.html";
}

// ─────────────────────────────
// NAV
// ─────────────────────────────
function setupNav() {
  const navBtn = document.getElementById("navBtn");
  const openLogin = document.getElementById("openLogin");

  if (openLogin && currentUser) {
    openLogin.style.display = "none";
  }

  if (navBtn) {
    if (currentUser) {
      navBtn.textContent = "Logga ut";
      navBtn.onclick = logout;
    } else {
      navBtn.textContent = "Logga in";
      navBtn.onclick = () => {
        window.location.href = "index.html";
      };
    }
  }
}

function renderUsername() {
  const usernameDisplay = document.getElementById("usernameDisplay");
  if (!usernameDisplay) return;

  usernameDisplay.textContent = currentUser ? currentUser.username : "gäst";
}

// ─────────────────────────────
// BOOKS
// ─────────────────────────────
async function fetchBooks() {
  try {
    const booksRes = await fetch(`${API}/books?populate=*`);
    const booksData = await booksRes.json();

    if (!booksRes.ok) {
      console.log("FETCH BOOKS ERROR:", booksData);
      showError("Kunde inte hämta böcker.");
      return;
    }

    books = booksData.data || [];

    await fetchAllRatings();

    if (document.getElementById("bookGrid")) {
      renderBooks();
    }
  } catch (error) {
    console.error(error);
    showError("Något gick fel när böckerna skulle hämtas.");
  }
}

async function fetchAllRatings() {
  const res = await fetch(`${API}/ratings?populate=*`);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("FETCH ALL RATINGS ERROR:", data);
    allRatings = [];
    return;
  }

  allRatings = data.data || [];
}

function setupSearch() {
  document.getElementById("searchInput")?.addEventListener("input", renderBooks);
}

function setSort(sortType) {
  currentSort = sortType;

  document.getElementById("sortNew")?.classList.toggle("active", sortType === "new");
  document.getElementById("sortTop")?.classList.toggle("active", sortType === "top");

  renderBooks();
}

function renderBooks() {
  const bookGrid = document.getElementById("bookGrid");
  const emptyMsg = document.getElementById("emptyMsg");

  if (!bookGrid) return;

  const searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";

  let filteredBooks = books.filter((book) => {
    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";
    return title.includes(searchValue) || author.includes(searchValue);
  });

  if (currentSort === "new") {
    filteredBooks.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  }

  if (currentSort === "top") {
    filteredBooks.sort((a, b) => {
      const ratingA = Number(getAverageRating(a)) || 0;
      const ratingB = Number(getAverageRating(b)) || 0;
      return ratingB - ratingA;
    });
  }

  bookGrid.innerHTML = "";

  if (emptyMsg) {
    emptyMsg.style.display = filteredBooks.length ? "none" : "block";
  }

  filteredBooks.forEach((book) => {
    const coverUrl = getCoverUrl(book);
    const avg = getAverageRating(book);

    const card = document.createElement("article");
    card.className = "book-card";
    card.onclick = () => openBookModal(book.documentId);

    card.innerHTML = `
      ${coverUrl
        ? `<img src="${coverUrl}" alt="${book.title}" class="book-cover">`
        : `<div class="book-cover placeholder-cover">
           <img src="BokDags.png" alt="BokDags">
         </div>`
  }


      <div class="book-info">
        <h2 class="book-title">${book.title}</h2>
        <p class="book-author">${book.author}</p>
        <p>${book.pages || "?"} sidor</p>
        <p>Utgiven: ${book.publishedDate || "Okänt"}</p>
        <p class="book-stars">★ ${avg}${avg !== "Inget betyg" ? "/10" : ""}</p>
      </div>
    `;

    bookGrid.appendChild(card);
  });
}

// ─────────────────────────────
// BOOK MODAL
// ─────────────────────────────
function openBookModal(documentId) {
  const book = books.find((b) => b.documentId === documentId);
  const modal = document.getElementById("bookModal");
  const overlay = document.getElementById("bookOverlay");

  if (!book || !modal || !overlay) return;

  const coverUrl = getCoverUrl(book);
  const avg = getAverageRating(book);

  modal.innerHTML = `
    <button class="btn-close" onclick="closeBookModal()">Stäng</button>

    ${
      coverUrl
        ? `<img src="${coverUrl}" alt="${book.title}">`
        : `<div class="book-cover placeholder-cover">
            <img src="BokDags.png" alt="BokDags">
          </div>`
    }

    <h2>${book.title}</h2>
    <p class="modal-author">${book.author}</p>

    <div class="modal-meta">
      <span>${book.pages || "?"} sidor</span>
      <span>${book.publishedDate || "Okänt datum"}</span>
    </div>

    <p><strong>Snittbetyg:</strong> ${avg}${avg !== "Inget betyg" ? "/10" : ""}</p>

    ${
      currentUser
        ? `
          <button class="btn-full" onclick="saveBook('${book.documentId}')">
            Spara i Att läsa
          </button>

          <div class="field">
            <label for="rating-${book.documentId}">Ditt betyg 1-10</label>
            <input id="rating-${book.documentId}" type="number" min="1" max="10" value="5">
          </div>

          <button class="btn-full" onclick="rateBook('${book.documentId}')">
            Betygsätt
          </button>
        `
        : `<p>Logga in för att spara och betygsätta.</p>`
    }
  `;

  overlay.classList.add("open");
}

function closeBookModal() {
  document.getElementById("bookOverlay")?.classList.remove("open");
}

// ─────────────────────────────
// SAVED BOOKS
// Kräver collection type: saved-book
// fields: userId, book
// ─────────────────────────────
async function fetchSavedBooks() {
  const container = document.getElementById("savedBooks");

  if (!currentUser || !token) {
    if (container) container.innerHTML = "<p>Logga in för att se dina sparade böcker.</p>";
    return;
  }

  try {
    const res = await fetch(
      `${API}/saved-books?filters[userId][$eq]=${currentUser.id}&populate[book][populate]=cover`,
      { headers: authHeaders() }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("FETCH SAVED BOOKS ERROR:", data);
      savedBooks = [];
      if (container) container.innerHTML = "<p>Kunde inte hämta sparade böcker.</p>";
      return;
    }

    savedBooks = data.data || [];

    renderSavedBooks();
  } catch (error) {
    console.error(error);
    if (container) container.innerHTML = "<p>Något gick fel.</p>";
  }
}

async function saveBook(bookDocumentId) {
  if (!currentUser || !token) {
    showError("Du måste vara inloggad.");
    return;
  }

  const alreadySaved = savedBooks.some((item) => {
    return item.book?.documentId === bookDocumentId;
  });

  if (alreadySaved) {
    showError("Boken finns redan i din Att läsa-lista.");
    return;
  }

  const res = await fetch(`${API}/saved-books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      data: {
        userId: currentUser.id,
        book: bookDocumentId,
      },
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("SAVE BOOK ERROR:", data);
    showError("Kunde inte spara boken. Kontrollera saved-book → create.");
    return;
  }

  alert("Boken sparades!");
  closeBookModal();

  await fetchSavedBooks();
}

async function removeSavedBook(savedBookDocumentId) {
  if (!currentUser || !token) return;

  const res = await fetch(`${API}/saved-books/${savedBookDocumentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("REMOVE SAVED BOOK ERROR:", data);
    showError("Kunde inte ta bort boken.");
    return;
  }

  await fetchSavedBooks();
}

function renderSavedBooks() {
  const container = document.getElementById("savedBooks");
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = "<p>Logga in för att se dina sparade böcker.</p>";
    return;
  }

  let list = [...savedBooks];

  const sort =
    typeof profileSavedSort !== "undefined"
      ? profileSavedSort
      : "title";

  if (sort === "title") {
    list.sort((a, b) =>
      (a.book?.title || "").localeCompare(b.book?.title || "", "sv")
    );
  }

  if (sort === "author") {
    list.sort((a, b) =>
      (a.book?.author || "").localeCompare(b.book?.author || "", "sv")
    );
  }

  if (!list.length) {
    container.innerHTML = "<p>Du har inte sparat några böcker än.</p>";
    return;
  }

  container.innerHTML = list
    .map((item) => {
      const book = item.book;
      const coverUrl = getCoverUrl(book);

      return `
        <article class="book-card">
          ${
            coverUrl
              ? `<img src="${coverUrl}" alt="${book?.title}" class="book-cover">`
              : `<div class="book-cover placeholder-cover">
                   <img src="BokDags.png" alt="BokDags">
                 </div>`
          }

          <div class="book-info">
            <h3 class="book-title">${book?.title || "Okänd bok"}</h3>
            <p class="book-author">${book?.author || ""}</p>

            <button class="btn-full" onclick="removeSavedBook('${item.documentId}')">
              Ta bort
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// ─────────────────────────────
// RATINGS
// Kräver collection type: rating
// fields: score, userId, book
// ─────────────────────────────
async function rateBook(bookDocumentId) {
  if (!currentUser || !token) {
    showError("Du måste vara inloggad.");
    return;
  }

  const input = document.getElementById(`rating-${bookDocumentId}`);
  const score = Number(input?.value);

  if (score < 1 || score > 10) {
    showError("Betyget måste vara mellan 1 och 10.");
    return;
  }

  const res = await fetch(`${API}/ratings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      data: {
        score: score,
        userId: currentUser.id,
        book: bookDocumentId,
      },
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("RATING ERROR:", data);
    showError("Kunde inte spara betyget. Kontrollera rating → create.");
    return;
  }

  alert("Betyget sparades!");
  closeBookModal();

  await fetchBooks();
  await fetchUserRatings();
}

async function fetchUserRatings() {
  const container = document.getElementById("recentRatings");

  if (!container) return;

  if (!currentUser || !token) {
    container.innerHTML = "<p>Logga in för att se dina betyg.</p>";
    return;
  }

  const res = await fetch(
    `${API}/ratings?filters[userId][$eq]=${currentUser.id}&populate=*`,
    { headers: authHeaders() }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.log("FETCH RATINGS ERROR:", data);
    container.innerHTML = "<p>Kunde inte hämta dina betyg.</p>";
    return;
  }

  console.log("USER RATINGS:", data);

  userRatings = data.data || [];
  renderUserRatings();
}

function renderUserRatings() {
  const container = document.getElementById("recentRatings");
  if (!container) return;

  let list = [...userRatings];

  const sort = profileRatingSort;

  if (sort === "rating") {
    list.sort((a, b) => Number(b.score) - Number(a.score));
  }

  if (sort === "title") {
    list.sort((a, b) => {
      return (a.book?.title || "").localeCompare(b.book?.title || "", "sv");
    });
  }

  if (sort === "author") {
    list.sort((a, b) => {
      return (a.book?.author || "").localeCompare(b.book?.author || "", "sv");
    });
  }

  if (!list.length) {
    container.innerHTML = "<p>Du har inte betygsatt några böcker än.</p>";
    return;
  }

  container.innerHTML = list
    .map((rating) => {
      const book = rating.book;
      const coverUrl = getCoverUrl(book);

      return `
        <article class="book-card">
          ${
            coverUrl
              ? `<img src="${coverUrl}" alt="${book?.title}" class="book-cover">`
              : `<div class="book-cover placeholder-cover">
                   <img src="BokDags.png" alt="BokDags">
                 </div>`
          }

          <div class="book-info">
            <h3 class="book-title">${book?.title || "Okänd bok"}</h3>
            <p class="book-author">${book?.author || ""}</p>
            <p class="book-stars">Ditt betyg: ${rating.score}/10</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function setupProfileSort() {
  document.getElementById("savedSort")?.addEventListener("change", renderSavedBooks);
  document.getElementById("ratingsSort")?.addEventListener("change", renderUserRatings);
}

// ─────────────────────────────
// ADMIN
// ─────────────────────────────
function setupAdmin() {
  document.getElementById("addBookBtn")?.addEventListener("click", addBookFromAdmin);

  document.getElementById("themeLight")?.addEventListener("click", () => setTheme("light"));
  document.getElementById("themeOcean")?.addEventListener("click", () => setTheme("ocean"));
  document.getElementById("themeNature")?.addEventListener("click", () => setTheme("nature"));
}

async function addBookFromAdmin() {
  if (!token) {
    showError("Du måste vara inloggad som admin.");
    return;
  }

  const title = document.getElementById("adminTitle")?.value.trim();
  const author = document.getElementById("adminAuthor")?.value.trim();
  const pages = Number(document.getElementById("adminPages")?.value);
  const publishedDate = document.getElementById("adminPublishedDate")?.value;
  const coverFile = document.getElementById("adminCover")?.files[0];

  if (!title || !author || !pages || !publishedDate) {
    showError("Fyll i titel, författare, antal sidor och datum.");
    return;
  }

  let coverId = null;

  if (coverFile) {
    const formData = new FormData();
    formData.append("files", coverFile);

    const uploadRes = await fetch(`${API}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.log("UPLOAD ERROR:", uploadData);
      showError("Kunde inte ladda upp bilden.");
      return;
    }

    coverId = uploadData[0].id;
  }

  const res = await fetch(`${API}/books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      data: {
        title,
        author,
        pages,
        publishedDate,
        cover: coverId,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("ADD BOOK ERROR:", data);
    showError("Kunde inte skapa boken.");
    return;
  }

  alert("Boken lades till!");

  document.getElementById("adminTitle").value = "";
  document.getElementById("adminAuthor").value = "";
  document.getElementById("adminPages").value = "";
  document.getElementById("adminPublishedDate").value = "";
  document.getElementById("adminCover").value = "";

  await fetchBooks();
}

// ─────────────────────────────
// THEME
// ─────────────────────────────
function setTheme(themeName) {
  document.body.classList.remove("theme-light", "theme-ocean", "theme-nature");
  document.body.classList.add(`theme-${themeName}`);

  localStorage.setItem("theme", themeName);
}

function applySavedTheme() {
  const theme = localStorage.getItem("theme");

  if (theme) {
    document.body.classList.add(`theme-${theme}`);
  }
}

function updateLogoForTheme(themeName) {
  document.querySelectorAll(".site-logo").forEach((logo) => {
    if (themeName === "dark") {
      logo.src = "BokDags-dark.jpg";
    } else {
      logo.src = "BokDags.png";
    }
  });
}

function setProfileSavedSort(sortType, button) {
  profileSavedSort = sortType;

  button.parentElement
    .querySelectorAll(".sort-btn")
    .forEach((btn) => btn.classList.remove("active"));

  button.classList.add("active");

  renderSavedBooks();
}

function setProfileRatingSort(sortType, button) {
  profileRatingSort = sortType;

  button.parentElement
    .querySelectorAll(".sort-btn")
    .forEach((btn) => btn.classList.remove("active"));

  button.classList.add("active");

  renderUserRatings();
}

function protectAdminPage() {
  const isAdminPage = window.location.pathname.includes("admin.html");

  if (!isAdminPage) return;

  if (!currentUser || currentUser.admin !== true) {
    alert("Du har inte behörighet till admin-sidan.");
    window.location.href = "index.html";
  }
}

function showAdminLink() {
  const adminLink = document.getElementById("adminLink");

  if (!adminLink) return;

  adminLink.style.display = currentUser?.admin === true ? "inline-block" : "none";
}