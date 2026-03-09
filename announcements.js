// Announcement data
let announcements = [];

function fetchAnnouncements() {
  $.ajax({
    url: "logic/get-announcements.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      announcements = data;
      renderAnnouncements(announcements);
    },
    error: function (error) {
      console.error("Error fetching announcements:", error);
    },
  });
}

// Call the function to fetch on page load
fetchAnnouncements();

// let announcements = initialAnnouncements.slice();

// DOM refs
const announcementList = document.getElementById("announcements");
const noAnnouncements = document.getElementById("noAnnouncements");
// Modals & backdrop refs
const detailsModal = document.getElementById("detailsModal");
const detailsBackdrop = document.getElementById("detailsBackdrop");
const addModal = document.getElementById("addModal");
const addBackdrop = document.getElementById("addBackdrop");

// Details modal content
const detailsTitle = document.getElementById("detailsTitle");
const detailsDesc = document.getElementById("detailsDesc");
const detailsImg = document.getElementById("detailsImg");
const detailsDate = document.getElementById("detailsDate");
// Add Modal refs
const addForm = document.getElementById("addForm");
const openAddBtn = document.getElementById("openAddBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeAddBtn = document.getElementById("closeAddBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderAnnouncements(announcements) {
  announcementList.innerHTML = "";
  if (announcements.length === 0) {
    noAnnouncements.style.display = "";
    return;
  }
  noAnnouncements.style.display = "none";
  for (const announcement of announcements) {
    const card = document.createElement("div");
    card.className = "card";
    card.id = announcement.id;
    card.tabIndex = 0;
    card.setAttribute("aria-label", announcement.title);
    if (announcement.image) {
      const img = document.createElement("img");
      img.src = "logic/uploads/" + announcement.image;
      img.alt = announcement.title;
      card.appendChild(img);
    }
    const content = document.createElement("div");
    content.className = "card-content";
    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = announcement.title;
    const desc = document.createElement("div");
    desc.className = "card-desc";
    desc.textContent = announcement.description;
    const date = document.createElement("div");
    date.className = "card-date";
    date.textContent = formatDate(announcement.postedAt);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(date);
    card.appendChild(content);
    card.onclick = () => openDetailsModal(announcement);
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        openDetailsModal(announcement);
      }
    };
    announcementList.appendChild(card);
  }
}

function formatLongDate(ms) {
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Details modal logic
function openDetailsModal(announcement) {
  detailsTitle.textContent = announcement.title;
  detailsDesc.textContent = announcement.description;

  if (announcement.image) {
    detailsImg.style.display = "";
    detailsImg.src = "logic/uploads/" + announcement.image;
    detailsImg.alt = announcement.title;
  } else {
    detailsImg.style.display = "none";
  }

  detailsDate.textContent = formatLongDate(announcement.postedAt);
  detailsModal.style.display = "";
  detailsBackdrop.style.display = "";
  document.body.style.overflow = "hidden";

  // Add Delete button
  const footer = document.getElementById("detailsModalFooter");
  footer.innerHTML = ""; // clear previous buttons
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Announcement";
  deleteBtn.style.cssText = `
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease;
  `;
  deleteBtn.onmouseover = () => (deleteBtn.style.backgroundColor = "#c0392b");
  deleteBtn.onmouseout = () => (deleteBtn.style.backgroundColor = "#e74c3c");

  deleteBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    $.ajax({
      url: "logic/delete-announcement.php",
      method: "POST",
      data: { id: announcement.id },
      success: function (response) {
        if (response.trim() === "success") {
          detailsModal.style.display = "none";
          detailsBackdrop.style.display = "none";
          document.body.style.overflow = "";
          fetchAnnouncements(); // Refresh the announcements list
          alert("Announcement deleted successfully.");
        } else {
          alert("Failed to delete: " + response);
        }
      },
      error: function () {
        alert("An error occurred while deleting.");
      },
    });
  });

  footer.appendChild(deleteBtn);
}

function closeDetailsModal() {
  detailsModal.style.display = "none";
  detailsBackdrop.style.display = "none";
  document.body.style.overflow = "";
}
closeModalBtn.onclick = closeDetailsModal;
detailsBackdrop.onclick = closeDetailsModal;
window.addEventListener("keydown", (e) => {
  if (
    (detailsModal.style.display !== "none" && e.key === "Escape") ||
    (addModal.style.display !== "none" && e.key === "Escape")
  ) {
    closeDetailsModal();
    closeAddModal();
  }
});

// Add announcement modal
openAddBtn.onclick = () => {
  addModal.style.display = "";
  addBackdrop.style.display = "";
  addForm.reset();
  addForm.title.focus();
  document.body.style.overflow = "hidden";
};
function closeAddModal() {
  addModal.style.display = "none";
  addBackdrop.style.display = "none";
  document.body.style.overflow = "";
}
closeAddBtn.onclick = closeAddModal;
cancelAddBtn.onclick = closeAddModal;
addBackdrop.onclick = closeAddModal;
