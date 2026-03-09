// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Court summary state
  let summaries = [];
  let editId = null;

  // DOM elements
  const summaryForm = document.getElementById("summaryForm");
  const formTitle = document.getElementById("formTitle");
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date");
  const descriptionInput = document.getElementById("description");
  const summariesList = document.getElementById("summariesList");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitBtn = summaryForm.querySelector('button[type="submit"]');
  const weekRangeElement = document.getElementById("weekRange");

  // Initialize the application
  function init() {
    // Set current date as default for the date input
    dateInput.value = formatDate(new Date());

    // Display the current week range in the header
    updateWeekRange();

    // Load saved summaries from local storage
    loadSummaries();

    // Set up event listeners
    setupEventListeners();
  }

  // Load summaries from local storage
  function loadSummaries() {
    $.getJSON("logic/get-summaries.php", function (data) {
      summaries = data || [];
      renderSummaries();
    });
  }

  // Set up event listeners for form submission and other interactions
  function setupEventListeners() {
    // Form submission
    summaryForm.addEventListener("submit", handleFormSubmit);

    // Cancel button
    cancelBtn.addEventListener("click", resetForm);
  }

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();

    const summaryData = {
      title: titleInput.value.trim(),
      date: dateInput.value,
      description: descriptionInput.value.trim(),
    };

    if (!summaryData.title || !summaryData.date) {
      alert("Title and Date are required.");
      return;
    }

    const isEdit = !!editId;
    const url = isEdit ? "logic/update-summary.php" : "logic/add-summary.php";

    if (isEdit) {
      summaryData.id = editId;
    }

    $.ajax({
      url,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(summaryData),
      success: function (response) {
        const res = JSON.parse(response);
        if (res.success) {
          if (isEdit) {
            // Update the item in local memory
            summaries = summaries.map((s) =>
              s.id === editId ? { ...s, ...summaryData } : s
            );
          } else {
            const newSummary = {
              id: res.id,
              ...summaryData,
              createdAt: new Date().toISOString(),
            };
            summaries = [newSummary, ...summaries];
          }

          renderSummaries();
          resetForm();
        } else {
          alert("Error: " + (res.message || "Unknown error"));
        }
      },
      error: function () {
        alert("Something went wrong while saving summary.");
      },
    });
  }

  // Reset form to initial state
  function resetForm() {
    editId = null;
    titleInput.value = "";
    dateInput.value = formatDate(new Date());
    descriptionInput.value = "";
    formTitle.textContent = "Add Court Summary";
    submitBtn.textContent = "Add Summary";
    cancelBtn.style.display = "none";
  }

  // Edit a summary
  function editSummary(id) {
    const summary = summaries.find((s) => s.id === id);
    if (summary) {
      editId = summary.id;
      titleInput.value = summary.title || "";
      dateInput.value = summary.date;
      descriptionInput.value = summary.description;
      formTitle.textContent = "Edit Court Summary";
      submitBtn.textContent = "Update Summary";
      cancelBtn.style.display = "inline-flex";
      // Scroll to the form
      window.scrollTo({
        top: summaryForm.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  // Delete a summary
  function deleteSummary(id) {
    if (!confirm("Are you sure you want to delete this summary?")) return;

    $.ajax({
      url: "logic/delete-summary.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id }),
      success: function (response) {
        console.log(response);
        const res = JSON.parse(response);
        if (res.success) {
          summaries = summaries.filter((summary) => summary.id !== id);
          renderSummaries();
        } else {
          alert("Error deleting summary: " + (res.message || "Unknown error"));
        }
      },
      error: function () {
        alert("Something went wrong while deleting summary.");
      },
    });
  }

  // Save summaries to local storage
  function saveSummaries() {
    localStorage.setItem("courtSummaries", JSON.stringify(summaries));
  }

  // Render summaries to the DOM
  function renderSummaries() {
    summariesList.innerHTML = "";

    if (summaries.length === 0) {
      summariesList.innerHTML = `
          <div class="empty-state">
            <p>No court summaries yet. Add your first one above.</p>
          </div>
        `;
      return;
    }

    summaries.forEach((summary) => {
      const card = document.createElement("div");
      card.className = "summary-card";
      card.innerHTML = `
          <div class="summary-header">
            <div class="summary-content">
              <h3 class="summary-title">${escapeHtml(summary.title)}</h3>
              <div class="summary-date">${formatDateLong(summary.date)}</div>
              <div class="summary-description">${escapeHtml(
                summary.description
              )}</div>
            </div>
            <div class="summary-actions">
              <button class="action-btn edit" aria-label="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
              </button>
              <button class="action-btn delete" aria-label="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;

      // Add event listeners for edit and delete buttons
      const editButton = card.querySelector(".action-btn.edit");
      const deleteButton = card.querySelector(".action-btn.delete");

      editButton.addEventListener("click", () => editSummary(summary.id));
      deleteButton.addEventListener("click", () => deleteSummary(summary.id));

      summariesList.appendChild(card);
    });
  }

  // Helper Functions

  // Generate a unique ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Format date to YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Format date to "Day, Month Date, Year"
  function formatDateLong(dateStr) {
    const date = new Date(dateStr);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  // Update the week range displayed in the header
  function updateWeekRange() {
    const today = new Date();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    // Adjust to get the start (Sunday) and end (Saturday) of the current week
    startOfWeek.setDate(today.getDate() - today.getDay());
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const startMonth = startOfWeek.toLocaleString("default", { month: "long" });
    const endMonth = endOfWeek.toLocaleString("default", { month: "long" });
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();
    const year = endOfWeek.getFullYear();

    const weekRange = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    weekRangeElement.textContent = weekRange;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize the application
  init();
});
