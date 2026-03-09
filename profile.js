// Denied Pages Data
const deniedPages = [];

// DOM Elements
const userAvatar = document.getElementById("user-avatar");
const avatarFallback = document.getElementById("avatar-fallback");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const deniedPagesList = document.getElementById("denied-pages-list");
const logoutButton = document.getElementById("logout-btn");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toast-title");
const toastMessage = document.getElementById("toast-message");
const toastClose = document.getElementById("toast-close");

function fetchUserAccess() {
  $.ajax({
    url: "logic/get-user-access.php",
    method: "GET",
    success: function (response) {
      const accessData =
        typeof response === "string" ? JSON.parse(response) : response;
      if (accessData.error) {
        showToast("Access Error", accessData.error);
        return;
      }

      const deniedPages = [];

      if (accessData.fa_access == 0) {
        deniedPages.push({
          id: 1,
          name: "Financial Audit",
          icon: "dollar-sign",
        });
      }
      if (accessData.team_access == 0) {
        deniedPages.push({ id: 2, name: "Teams", icon: "users" });
      }
      if (accessData.tasks_access == 0) {
        deniedPages.push({ id: 3, name: "Tasks", icon: "clipboard" });
      }
      if (accessData.cases_access == 0) {
        deniedPages.push({ id: 4, name: "Cases", icon: "briefcase" });
      }
      if (accessData.calendar_access == 0) {
        deniedPages.push({ id: 5, name: "Calendar", icon: "calendar" });
      }

      renderDeniedPages(deniedPages);
    },
    error: function () {
      showToast("Error", "Failed to fetch user access data.");
    },
  });
}

// Initialize Page
function initPage() {
  fetchUserAccess();

  // Event listeners
  logoutButton.addEventListener("click", handleLogout);
  toastClose.addEventListener("click", hideToast);
}

// Render denied pages list
function renderDeniedPages(deniedPages) {
  if (deniedPages.length > 0) {
    deniedPagesList.innerHTML = "";
  }

  deniedPages.forEach((page) => {
    const pageElement = document.createElement("div");
    pageElement.className = "denied-page";

    const iconClass = getIconClass(page.icon);

    pageElement.innerHTML = `
      <div class="page-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="page-info">
        <h3>${page.name}</h3>
        <p>Access required</p>
      </div>
      <div class="denied-badge">Denied</div>
    `;

    deniedPagesList.appendChild(pageElement);
  });
}

// Get icon class based on icon name
function getIconClass(iconName) {
  switch (iconName) {
    case "dollar-sign":
      return "fas fa-dollar-sign dollar-sign";
    case "users":
      return "fas fa-users users";
    case "clipboard":
      return "fas fa-clipboard-list clipboard";
    case "briefcase":
      return "fas fa-briefcase briefcase";
    case "calendar":
      return "fas fa-calendar calendar";
    default:
      return "fas fa-lock";
  }
}

// Handle logout
function handleLogout() {
  showToast("Logging out", "You have been successfully logged out.");
}

// Show toast notification
function showToast(title, message) {
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.add("visible");

  // Auto-hide toast after 5 seconds
  setTimeout(() => {
    hideToast();
  }, 5000);
}

// Hide toast notification
function hideToast() {
  toast.classList.remove("visible");
}

// Initialize the page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initPage);
